package main

import (
	"os"
	"text/template"
)

const parseConfig = `  
{
    "applications": {
        "_default": {
            "link": "sheki"
        }, 
        "sheki": {
            "applicationId": "{{.AppID}}", 
            "masterKey": "{{.MasterKey}}"
        }
    }, 
    "global": {
        "parseVersion": "1.3.2"
    }
}
`

type creds struct {
	AppID, MasterKey string
}

func main() {
	t := template.Must(template.New("config").Parse(parseConfig))
	c := creds{
		AppID:     os.Getenv("APP_ID"),
		MasterKey: os.Getenv("MASTER_KEY"),
	}
	if err := t.Execute(os.Stdout, c); err != nil {
		panic(err)
	}
}
