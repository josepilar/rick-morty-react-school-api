define({ "api": [
  {
    "type": "get",
    "url": "/lists",
    "title": "Get a list of lists",
    "version": "1.0.0",
    "name": "getLists",
    "group": "Lists",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "Object",
            "description": "<p>Array with a lists.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n[\n {\n  \"id\": \"d2eb58d6-f4ec-4343-9224-97ff4618f4e7\",\n  \"name\": \"favories\",\n  \"items\": []\n }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/index.js",
    "groupTitle": "Lists",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/lists"
      }
    ]
  },
  {
    "type": "get",
    "url": "/lists/:id",
    "title": "Get a specific list",
    "version": "1.0.0",
    "name": "getLists",
    "group": "Lists",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "listObject",
            "description": "<p>List details.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n \"id\": \"d2eb58d6-f4ec-4343-9224-97ff4618f4e7\",\n \"name\": \"favories\",\n \"items\": []\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/index.js",
    "groupTitle": "Lists",
    "sampleRequest": [
      {
        "url": "http://localhost:4000/api/lists/:id"
      }
    ]
  }
] });
