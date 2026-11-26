FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    latexmk \
    biber \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-science \
    texlive-bibtex-extra \
    texlive-xetex \
    texlive-luatex \
    texlive-fonts-recommended \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Harden TeX configuration: disable shell escape and restrict file I/O to workspace
RUN mkdir -p /etc/texmf/texmf.d \
    && printf "shell_escape = f\nopenin_any = p\nopenout_any = p\n" > /etc/texmf/texmf.d/99-sandbox.cnf \
    && update-texmf

# Create unprivileged non-root worker user
RUN groupadd --gid 10001 texworker \
    && useradd --uid 10001 --gid 10001 --create-home --shell /usr/sbin/nologin texworker

COPY entrypoint.sh /usr/local/bin/tex-worker-entrypoint
RUN chmod 0755 /usr/local/bin/tex-worker-entrypoint

USER texworker
WORKDIR /work

ENTRYPOINT ["/usr/local/bin/tex-worker-entrypoint"]
