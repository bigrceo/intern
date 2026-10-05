# Intern computers

Each intern or thread gets its own desktop sandbox on the computers host (EC2, us-east-1).

- `desktop/`: the sandbox image. Debian, Xvfb 1280x800, openbox + tint2, the dithered intern wallpaper, Chromium (`browser`), Python with pandas/matplotlib, Node, x11vnc + noVNC for the live view, and `agentd` (screenshot, xdotool actions, shell, files) on :8000.
- `hostd.py`: the host API on :8443 (TLS, bearer token), reachable only from the Intern VM. Wake, sleep, delete, stats, and proxies for screenshot / action / exec / files, plus the noVNC websocket. Idle sandboxes sleep after 10 minutes; files persist in a per-sandbox volume.
- Sandboxes run under gVisor (`--runtime=runsc`) with CPU, memory and pid limits. The host drops container traffic to the AWS metadata address and the VPC.

Build: `docker build -t intern-desktop:latest desktop/`. Service: `mc-hostd.service`, env in `/etc/intern-computers.env` (`MC_TOKEN`).
