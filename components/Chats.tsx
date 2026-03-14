"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'

export default function Chats() {
    const [isPDFUploaded, setIsPDFUploaded] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const handleChange = async (e:any)=>{
        const selectedFile = e.target.files[0]
        if(!selectedFile) return
        setName("Processing File: " + selectedFile.name + "...")
        setFile(selectedFile)
        const formData = new FormData()
        formData.append("file", selectedFile)
        try{    
            const response = await fetch("/api/upload",{
                method:"POST",
                body: formData
            })
            const data = await response.json()
            if(data.success){
                setIsPDFUploaded(true)
                let st = await JSON.parse(localStorage.getItem("pdfs") || "[]")
                if(!st)st=[]
                st.push(data.colname)
                localStorage.setItem("pdfs", await JSON.stringify(st))
                setName("Upload Complete")
            }
        }catch(err){
            console.log("Error Occured",err)
        }
    }

    if(!isPDFUploaded){
        return (
            <div className='h-full w-full flex flex-col justify-center items-center'>
                <div>{name}</div>  
                {!name.length && (
                    <div>
                        <label htmlFor="file" className='cursor-pointer rounded-full bg-zinc-200 px-4 py-2'>
                            Upload PDF File
                        </label>
                        <input 
                            onChange={handleChange}
                            type='file'
                            id="file"
                            accept=".pdf"
                            className='hidden'
                        />
                    </div>
                )}
            </div>
        )
    }
    
    return (
        <div className='h-full w-full'>
            <div className='text-center text-sm'>{name==="Upload Complete" && "Upload Completed and Embeddings Created. Ask Anything " }</div>
        </div>
    )
}