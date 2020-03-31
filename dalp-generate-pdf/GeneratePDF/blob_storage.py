import os
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from fpdf import FPDF
from datetime import datetime


def upload_blob_get_url(data, classID):
    try:
        # Quick start code goes here
        connect_str = os.environ["BLOB_STORAGE_CONNECTION_URL"]
        # Create the BlobServiceClient object which will be used to create a container client
        blob_service_client = BlobServiceClient.from_connection_string(
            connect_str)

        container_list = blob_service_client.list_containers()
        container_names = []
        for container in container_list:
            print(container.name)
            container_names.append(container.name)

        container_name = classID.lower()

        if container_name not in container_names:
            blob_service_client.create_container(
                container_name, public_access="container"
            )

        # Create a file in local data directory to upload and download
        now = datetime.now()
        local_file_name = f'{container_name}_{now.strftime("%Y%m%dT%H%M%S")}.pdf'
        print("File name " + local_file_name)
        # Create a blob client using the local file name as the name for the blob
        blob_client = blob_service_client.get_blob_client(
            container=container_name, blob=local_file_name
        )

        print(
            "\nUploading to Azure Storage as blob:\n\t"
            + container_name
            + "  ->  "
            + local_file_name
        )

        blob_client.upload_blob(data)
        print("*" * 10)
        print(blob_client.url)
        print("*" * 10)
        return {"type": "url", "data": blob_client.url}

    except Exception as ex:
        print("Exception:")
        print(ex)
        return {"type": "error", "data": str(ex)}
