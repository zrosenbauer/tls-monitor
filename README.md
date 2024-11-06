<div>
    <p align="center">
        <img src="/logo.png" align="center" width="300" />
    </p>
    <hr>
</div>

> Monitor your certificates!

# Overview

[![CI](https://github.com/zrosenbauer/tls-monitor/actions/workflows/ci.yaml/badge.svg)](https://github.com/zrosenbauer/tls-monitor/actions/workflows/ci.yaml)
[![CodeQL](https://github.com/zrosenbauer/tls-monitor/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/zrosenbauer/tls-monitor/actions/workflows/codeql-analysis.yml)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

Monitor SSL/TLS certificates for your domains.

## Usage

You can run against a single domain or use the matrix strategy to run against multiple domains.

### Single Domain

```yaml
name: SSL/TLS Monitor
on:
  schedule:
    - cron: '0 16 * * *'

jobs:
  monitor:
    name: SSL/TLS Monitor
    runs-on: ubuntu-latest
    steps:
      - name: Monitor
        uses: zrosenbauer/action-tls-monitor@main
        with:
          domain: joggr.io
          expiration_days: 30
          approved_protocols: TLSv1.2,TLSv1.3
          alert_method: slack
          alert_token: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Multiple Domains

```yaml
name: SSL/TLS Monitor
on:
  schedule:
    - cron: '0 16 * * *'

jobs:
  monitor:
    name: SSL/TLS Monitor
    runs-on: ubuntu-latest
    strategy:
      matrix:
        domain:
          - joggr.io
          - docs.joggr.io
    steps:
      - name: Monitor - ${{ matrix.domain }}
        uses: zrosenbauer/action-tls-monitor@main
        with:
          domain: ${{ matrix.domain }}
          expiration_days: 30
          approved_protocols: TLSv1.2,TLSv1.3
          alert_method: slack
          alert_token: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Alerting

Alerting is built in to this action. It is also possible to ignore the alerts and use the outputs to send your own alerts or do
another action (i.e. trigger a certificate update/renewal).

### Slack Alerts

Slack is supported out of the box. The alerts are formatted and have a default emoji and name. You should start to see alerts
similar to the below image if an issue is found.

<details>
<summary>Slack Alert Example</summary>

![Slack Alert](/docs/images/alert-slack.png)

</details>

<br>
<br>
<hr>
<div align="center">
      <h2>Sponsorship</h1>
      <sup>Special thanks to:</sup>
      <br>
      <br>
      <a href="https://joggr.io">
      <img src="https://storage.googleapis.com/joggr-public-assets/logos/logo.png" width="160"/>
      </a>
</div>
