# SSL/TLS Monitor

[![CI](https://github.com/bluenovaio/action-tls-monitor/actions/workflows/ci.yaml/badge.svg)](https://github.com/bluenovaio/action-tls-monitor/actions/workflows/ci.yaml)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

Monitor SSL/TLS certificates for your domains.

## Usage

You can run against a single domain or use the matrix strategy to run against multiple domains.

**Single Domain**
```yaml
name: SSL/TLS Monitor 
on:
  schedule:
    - 

jobs:
  monitor:
    name: SSL/TLS Monitor
    runs-on: ubuntu-latest
    steps:
      - name: Monitor
        uses: bluenovaio/action-tls-monitor@main
        with: 
          domain: bluenova.io
          expiration_days: 30
          approved_protocols: TLSv1.2,TLSv1.3
          alert_method: slack
          alert_token: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Multiple Domains**
```yaml
name: SSL/TLS Monitor 
on:
  schedule:
    - 

jobs:
  monitor:
    name: SSL/TLS Monitor
    runs-on: ubuntu-latest
    strategy:
      matrix:
        domain:
          - bluenova.io
          - docs.bluenova.io
    steps:
      - name: Monitor - ${{ matrix.domain }}
        uses: bluenovaio/action-tls-monitor@main
        with:
          domain: ${{ matrix.domain }}
          expiration_days: 30
          approved_protocols: TLSv1.2,TLSv1.3
          alert_method: slack
          alert_token: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Alerting

Alerting is built in to this action but its also possible to just use the outputs to send your own alerts or do
another action (i.e. trigger a certificate update/renewal). Currently, only (slack)[https://slack.com] is supported.
