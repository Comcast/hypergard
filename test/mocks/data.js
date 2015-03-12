/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
var
  homepage = {
    "_links": {
      "curies": [
        {
          "name": "test",
          "href": "http://www.example.com/docs/{rel}",
          "templated": true
        },
        {
          "href": "invalid curie"
        }
      ],
      "self": {
        "href": "./"
      },
      "noHref": {
        "title": "No href, just title"
      },
      "noTitle": {
        "href": "no/title"
      },
      "noParams": {
        "href": "no/params/",
        "title": "Link with no params"
      },
      "noParamsNotTemplated": {
        "href": "no/params/",
        "title": "Link with no params, templated false",
        "templated": false
      },
      "noParamsTemplated": {
        "href": "no/params/",
        "title": "Link with no params, templated true",
        "templated": true
      },
      "oneParamPath": {
        "href": "one/param/{path}/",
        "title": "One param in path",
        "templated": true
      },
      "oneParamQuery": {
        "href": "one/param/{?query}",
        "title": "One param in query",
        "templated": true
      },
      "twoParamsMixed": {
        "href": "two/params/{path}/{?query}",
        "title": "Two params, one in path, one in query",
        "templated": true
      },
      "twoParamsPath": {
        "href": "two/params/{path1}/{path2}/",
        "title": "Two params in path",
        "templated": true
      },
      "twoParamsQuery": {
        "href": "two/params/{?query1,query2}",
        "title": "Two params in query",
        "templated": true
      },
      "twoParamsQueryAndExisting": {
        "href": "two/params/?test=1{&query1,query2}",
        "title": "Two params in query with hard coded param",
        "templated": true
      },
      "twoParamsQueryInvalidAndExisting": {
        "href": "two/params/?test=1{?query1,query2}",
        "title": "Two wrongly formatted params in query with hard coded param",
        "templated": true
      },
      "rootRelativeUrl": {
        "href": "/root/relative/",
        "title": "Root relative url",
        "templated": false
      },
      "pathRelativeUrl": {
        "href": "../root/relative/",
        "title": "Path relative url",
        "templated": false
      },
      "absoluteUrl": {
        "href": "http://www.example.com",
        "title": "Absolute url",
        "templated": false
      },
      "linkList": [
        {
          "href": "first/link",
          "title": "first link"
        },
        {
          "href": "second/link",
          "title": "second link"
        }
      ],
      "test:curie-test": {
        "href": "/curie/test/",
        "title": "Curie test link"
      }
    },
    "_forms": {
      "formNoAction": {
        "method": "POST",
        "fields": {}
      },
      "formNoMethod": {
        "action": "form/",
        "fields": {}
      },
      "formGetNoFields": {
        "action": "form/",
        "method": "GET"
      },
      "formGetEmptyFields": {
        "action": "form/",
        "method": "GET",
        "fields": {}
      },
      "formGetOneField": {
        "action": "form/",
        "method": "GET",
        "fields": {
          "param": {}
        }
      },
      "formGetTwoFields": {
        "action": "form/",
        "method": "GET",
        "fields": {
          "param1": {},
          "param2": {}
        }
      },
      "formGetTwoFieldsDefaultValue": {
        "action": "form/",
        "method": "GET",
        "fields": {
          "param1": {
            "default": "test"
          },
          "param2": {}
        }
      },
      "formPostNoFields": {
        "action": "form/",
        "method": "POST"
      },
      "formPostEmptyFields": {
        "action": "form/",
        "method": "POST",
        "fields": {}
      },
      "formPostOneField": {
        "action": "form/",
        "method": "POST",
        "fields": {
          "param": {}
        }
      },
      "formPostTwoFields": {
        "action": "form/",
        "method": "POST",
        "fields": {
          "param1": {},
          "param2": {}
        }
      },
      "formPostTwoFieldsDefaultValue": {
        "action": "form/",
        "method": "POST",
        "fields": {
          "param1": {
            "default": "test"
          },
          "param2": {}
        }
      },
      "formPostWithTemplatedAction": {
        "action": "form/{param}/test",
        "method": "POST",
        "fields": {
          "param1": {},
          "param2": {}
        },
        "templated": true
      }
    }
  },

  actionResponse = {
    "_links": {
      "self": {
        "href": "./"
      }
    },
    "_embedded": {
      "one": {
        "id": "636363636363",
        "title": "One Title",
        "nestedProp": {
          "name": "Prop value"
        },
        "_embedded": {
          "sub_one": null
        }
      },
      "two": [{
        "_links": {
          "self": {
            "href": "./"
          },
          "linkedEmbedded": {
            "href": "../linked"
          }
        },
        "_embedded": {
          "sub_two": {
            "_links": {
              "self": {
                "href": "../../../test/id/"
              }
            },
            "_embedded": {
              "images": [{
                "_links": {
                  "imageUrl": {
                    "href": "http://some.cdn/foo/bar.jpg"
                  }
                },
                "width": 50,
                "height": 30
              }],
              "company": [{
                "_links": {
                  "self": {
                    "href": "../../../text/company/"
                  },
                  "companyUrl": {
                    "href": "http://companyUrl"
                  }
                },
                "_embedded": {
                  "images": []
                },
                "id": "12345",
                "name": "Test Company",
                "title": "Title of company",
                "description": "Description of company"
              }]
            },
            "id": "98756",
            "title": "Sub one title"
          }
        },
        "id": "78423y08"
      }],
      "three": {
        "_links": {
          "self": "../linked"
        },
        "id": "linked123"
      }
    }
  };
