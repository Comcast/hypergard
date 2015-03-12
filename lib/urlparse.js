/**
 * @constructor
 */
function UrlParse() {
  var
  // scheme (optional), host, port
    fullurl = /^([A-Za-z]+)?(:?\/\/)([0-9.\-A-Za-z]*)(?::(\d+))?(.*)$/,
  // path, query, fragment
    parse_leftovers = /([^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;

  // Unlike to be useful standalone
  //
  // NORMALIZE PATH with "../" and "./"
  //   http://en.wikipedia.org/wiki/URL_normalization
  //   http://tools.ietf.org/html/rfc3986#section-5.2.3
  //
  this.normalizepath = function(path) {
    if (!path || path === '/') {
      return '/';
    }

    var
      parts = path.split('/'),
      newparts = [];

    // make sure path always starts with '/'
    if (parts[0]) {
      newparts.push('');
    }

    parts.forEach(function(part) {
      if (part === '..') {
        if (newparts.length > 1) {
          newparts.pop();
        } else {
          newparts.push(part);
        }
      } else if (part !== '.') {
        newparts.push(part);
      }
    });

    return newparts.join('/') || '/';
  };

  //
  // Does many of the normalizations that the stock
  //  python urlsplit/urlunsplit/urljoin neglects
  //
  // Doesn't do hex-escape normalization on path or query
  //   %7e -> %7E
  // Nor, '+' <--> %20 translation
  //
  this.urlnormalize = function(url) {
    var parts = this.urlsplit(url);

    switch (parts.scheme) {
      case 'file':
        // files can't have query strings
        //  and we don't bother with fragments
        parts.query = '';
        parts.fragment = '';
        break;
      case 'http':
      case 'https':
        // remove default port
        if ((parts.scheme === 'http' && parts.port == 80) ||
          (parts.scheme === 'https' && parts.port == 443)) {
          delete parts.port;
          // hostname is already lower case
          parts.netloc = parts.hostname;
        }
        break;
      default:
        // if we don't have specific normalizations for this
        // scheme, return the original url unmolested
        return url;
    }

    // for [file|http|https].  Not sure about other schemes
    parts.path = this.normalizepath(parts.path);

    return this.urlunsplit(parts);
  };

  this.urldefrag = function(url) {
    var idx = url.indexOf('#');
    return (idx === -1) ? [url, ''] : [url.substr(0, idx), url.substr(idx + 1)];
  };

  this.urlsplit = function(url, default_scheme, allow_fragments) {
    allow_fragments = allow_fragments !== false;

    var
      leftover,
      o = {},
      parts = (url || '').match(fullurl);

    if (parts) {
      o.scheme = parts[1] || default_scheme || '';
      o.hostname = parts[3].toLowerCase() || '';
      o.port = parseInt(parts[4], 10) || '';
      // Probably should grab the netloc from regexp
      //  and then parse again for hostname/port

      o.netloc = parts[3];

      if (parts[4]) {
        o.netloc += ':' + parts[4];
      }

      leftover = parts[5];
    } else {
      o.scheme = default_scheme || '';
      o.netloc = '';
      o.hostname = '';
      leftover = url;
    }
    o.scheme = o.scheme.toLowerCase();

    parts = leftover.match(parse_leftovers);

    o.path = parts[1] || '';
    o.query = parts[2] || '';

    o.fragment = allow_fragments ? (parts[3] || '') : '';

    return o;
  };

  this.urlunsplit = function(o) {
    var s = '';

    if (o.scheme) {
      s += o.scheme + '://';
    }

    if (o.netloc) {
      if (s === '') {
        s += '//';
      }

      s += o.netloc;
    } else if (o.hostname) {
      // extension.  Python only uses netloc
      if (s === '') {
        s += '//';
      }

      s += o.hostname;

      if (o.port) {
        s += ':' + o.port;
      }
    }

    if (o.path) {
      s += o.path;
    }

    if (o.query) {
      s += '?' + o.query;
    }

    if (o.fragment) {
      s += '#' + o.fragment;
    }

    return s;
  };

  this.urljoin = function(base, url, allow_fragments) {
    if (typeof allow_fragments === 'undefined') {
      allow_fragments = true;
    }

    var url_parts = this.urlsplit(url);

    // if url parts has a scheme (i.e. absolute)
    // then nothing to do
    if (url_parts.scheme) {
      return !allow_fragments ? url : this.urldefrag(url)[0];
    }

    var base_parts = this.urlsplit(base);

    // copy base, only if not present
    if (!base_parts.scheme) {
      base_parts.scheme = url_parts.scheme;
    }

    // copy netloc, only if not present
    if (!base_parts.netloc || !base_parts.hostname) {
      base_parts.netloc = url_parts.netloc;
      base_parts.hostname = url_parts.hostname;
      base_parts.port = url_parts.port;
    }

    // paths
    if (url_parts.path.length > 0) {
      if (url_parts.path.charAt(0) === '/') {
        base_parts.path = url_parts.path;
      } else {
        // relative path.. get rid of "current filename" and
        //   replace.  Same as var parts =
        //   base_parts.path.split('/'); parts[parts.length-1] =
        //   url_parts.path; base_parts.path = parts.join('/');
        var idx = base_parts.path.lastIndexOf('/');
        if (idx === -1) {
          base_parts.path = url_parts.path;
        } else {
          base_parts.path = base_parts.path.substr(0, idx) + '/' +
            url_parts.path;
        }
      }
    }

    // clean up path
    base_parts.path = this.normalizepath(base_parts.path);

    // copy query string
    base_parts.query = url_parts.query;

    // copy fragments
    base_parts.fragment = allow_fragments ? url_parts.fragment : '';

    return this.urlunsplit(base_parts);
  };
}

export default new UrlParse();
