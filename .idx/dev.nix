# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  channel = "stable-23.11"; # "stable-23.11" or "unstable"
  # Use https://search.nixos.org/packages to  find packages
  packages = [
    pkgs.nodejs_20
    # pkgs.go
  ];
  # Sets environment variables in the workspace
  env = {
    port="8282"; #dont use restricted ports (8000, 9000-9002)
    API_SERVICE = "https://$port-$WEB_HOST";

  };
  # search for the extension on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "esbenp.prettier-vscode"
    "rangav.vscode-thunder-client"
    "codeium.codeium" 
  ];
  # preview configuration, identical to monospace.json
  idx.previews = {
    enable = true;
    previews = [
      {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "8282"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        id = "web";
        manager = "web";
      }
    ];
  };
}
