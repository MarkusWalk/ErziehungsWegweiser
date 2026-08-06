#!/bin/sh
# Veröffentlicht den Inhalt von docs/ als Wurzel des Branches gh-pages.
#
# Warum ein eigener Branch: Bei "Deploy from a branch" muss in den
# Repo-Einstellungen zusätzlich der Unterordner /docs gewählt werden.
# Steht dort versehentlich "/ (root)", liefert Pages 404 auf alles, weil
# im Wurzelverzeichnis von main keine index.html liegt. Mit gh-pages
# entfällt diese Auswahl: dort IST die Wurzel die Seite.
#
# Aufruf:  sh build/publish.sh

set -e
cd "$(git rev-parse --show-toplevel)"

echo "Neu bauen …"
node build/build.mjs --quiet

if ! git diff --quiet -- docs; then
  echo ""
  echo "docs/ hat sich geändert. Bitte erst committen:"
  git diff --stat -- docs
  exit 1
fi

echo "docs/ nach gh-pages übertragen …"
git subtree push --prefix docs origin gh-pages
echo ""
echo "Fertig. Pages-Einstellung: Deploy from a branch → gh-pages → / (root)"
