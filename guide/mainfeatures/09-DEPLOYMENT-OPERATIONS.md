# 09 — Deployment, Operations and Capacity Planning

## 1. Services

- Nginx with TLS.
- Laravel application.
- Queue workers.
- MySQL.
- Redis.
- Reverb.
- Compiler worker images.
- Conversion worker image.
- OCR worker image if enabled.
- Python runner image if enabled.
- Private artifact storage.
- Backup agent and monitoring.

## 2. Compiler image profiles

| Profile | Intended use |
|---|---|
| Standard | Common article/report/thesis workflows |
| Research | Bibliography, graphics, tables, algorithms, glossaries and common research packages |
| Extended | Specialist/publisher workflows requiring additional packages or fonts |

Use versioned and digest-pinned images. A full TeX Live image may reduce missing-package issues but increases image size, storage, update time and attack surface. Define profiles from actual corpus measurements.

The Ayaka-notes TeX Live Full project documents a multi-architecture image and preinstalled TeX Live packages, fonts and utilities; it is useful as a benchmark/reference for image composition and operational issues. Do not depend on that image automatically. Build and validate first-party images or use an explicitly approved upstream image. Review font licences before redistribution.

## 3. Capacity planning

Do not choose quotas from guesswork. Benchmark:
- idle memory of each service;
- peak memory per compile profile;
- CPU time and wall time by corpus project;
- disk usage and image pull/storage footprint;
- OCR model memory and latency;
- simultaneous builds;
- queue wait time;
- conversion throughput.

Set limits at container runtime, not only in PHP validation.

## 4. Monitoring

Monitor:
- queue depth and oldest job age;
- active/failed/timed-out builds;
- worker restarts;
- CPU/RAM/disk saturation;
- storage growth;
- artifact publishing failures;
- database and Redis health;
- integration sync failures;
- AI/OCR provider errors and cost;
- auth failures and suspicious access.

## 5. Backup and recovery

- Daily database backup and point-in-time recovery strategy where feasible.
- Artifact backup and checksum verification.
- Configuration and image manifest backup.
- Off-server copy.
- Restore drills.
- Retention and deletion policy.
- Document RPO/RTO targets after operational requirements are known.

## 6. Admin panel

- Users, organizations, projects and templates.
- Search and bulk operations.
- User sessions and forced logout.
- Audit logs.
- Build queues and worker health.
- Resource quotas and usage.
- Compiler image versions.
- Feature flags and integration provider configuration.
- Maintenance mode and service status.
