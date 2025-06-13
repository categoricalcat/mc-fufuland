// unzip the-modpack.mrpack into .backups/the-modpack
// start processing modrinth.index.json
// get all ModrinthIndex["files"][number]["downloads"]
// "https://cdn.modrinth.com/data/{project_id}/versions/{version_id}/file.jar"
// for each download, get project_id and fetch "https://api.modrinth.com/v2/project/{project_id}"
// replace  ModrinthIndex["files"][number]["env"] with  ModrinthProject["client_side"] and ModrinthProject["server_side"] from request
// write copy index-copy.json
