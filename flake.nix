{
  description = "West Restaurant website — Hugo static site deployed via Cloudflare Pages";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/832efc09b4caf6b4569fbf9dc01bec3082a00611";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};

          publish = pkgs.writeShellScriptBin "publish" ''
            set -e
            echo "Running local build check..."
            if ! hugo --minify > /dev/null 2>&1; then
              echo "❌ Build failed! Aborting publish."
              hugo --minify
              exit 1
            fi
            echo "✅ Build passed."
            jj describe -m "''${1:-chore: update site}"
            jj bookmark set main -r @
            jj git push --bookmark main
            echo "Done! Cloudflare will build and deploy to https://westrotterdam.nl in a few minutes."
          '';
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              hugo
              go
              jujutsu
              git
              tailwindcss
              publish
            ];

            shellHook = ''
              echo ""
              echo "  West Restaurant — dev environment"
              echo ""
              echo "  Commands:"
              echo "    hugo server       — lokale preview op http://localhost:1313"
              echo "    hugo --minify     — productie build (vereist: nix develop)"
              echo "    publish [message] — commit + push (Cloudflare deployt automatisch)"
              echo "    jj log            — geschiedenis"
              echo "    jj st             — status"
              echo ""
            '';
          };
        });
    };
}
