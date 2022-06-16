import React from 'react'

const DownloadFile = ({downloadPageLink}) => {
  return (
    <div className='p-1'>
        <h1 className="my-2 text-lg font-medium">Test text</h1>
        <div className="flex space-x-3"><span className="break-all">{downloadPageLink}</span></div>
        <img src="images/copy.png" alt="" className="w-8 h-8 object-contain cursor-pointer" onClick={()=>navigator.clipboard.writeText(downloadPageLink)}/>
    </div>
  )
}

export default DownloadFile