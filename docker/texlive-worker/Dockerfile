FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    jq \
    latexmk \
    biber \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-science \
    texlive-bibtex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-xetex \
    texlive-luatex \
    texlive-pictures \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 10001 --shell /bin/bash texworker

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER texworker
WORKDIR /work

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
