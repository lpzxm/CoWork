import React from 'react'
import { VscFilePdf, VscFileZip, VscFile } from 'react-icons/vsc'

const BYTE = 1000
const getKB = (bytes) => Math.round(bytes / BYTE)

const FileIcon = ({ children }) => {
    return <span className="text-4xl">{children}</span>
}

const FileItem = (props) => {
    const { file, children } = props
    const { type, name, size } = file

    const isImageFile = type.split('/')[0] === 'image'

    let thumbnail = (
        <FileIcon>
            <VscFile />
        </FileIcon>
    )

    if (isImageFile) {
        thumbnail = (
            <img
                className="upload-file-image"
                src={URL.createObjectURL(file)}
                alt={`file preview ${name}`}
            />
        )
    } else if (type === 'application/zip') {
        thumbnail = (
            <FileIcon>
                <VscFileZip />
            </FileIcon>
        )
    } else if (type === 'application/pdf') {
        thumbnail = (
            <FileIcon>
                <VscFilePdf />
            </FileIcon>
        )
    }

    return (
        <div className="upload-file">
            <div className="flex">
                <div className="upload-file-thumbnail">{thumbnail}</div>
                <div className="text-xs upload-file-info">
                    <p className="upload-file-name">{name}</p>
                    <span className="upload-file-size">{getKB(size)} kb</span>
                </div>
            </div>
            {children}
        </div>
    )
}

export default FileItem
