"""Read the WordPress TAR, including its legacy ustar headers."""
import pathlib
import os
import sys
import tarfile

destination = pathlib.Path(sys.argv[2]).resolve()
with tarfile.open(sys.argv[1]) as archive:
    members = archive.getmembers()
    for member in members:
        target = (destination / member.name).resolve()
        if not target.is_relative_to(destination) or target == destination:
            raise ValueError(f"Unsafe archive path: {member.name}")
        if not (member.isfile() or member.isdir()):
            raise ValueError(f"Unsupported archive entry: {member.name}")
    extraction_path = f"\\\\?\\{destination}" if os.name == "nt" else str(destination)
    archive.extractall(extraction_path, members=members, filter="data")
print(f"Extracted {len(members)} media entries.")
