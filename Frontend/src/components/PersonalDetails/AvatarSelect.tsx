// import React, { useState } from "react";
// import { FileUploader } from "react-drag-drop-files";
// import AvatarCropPopup from "./AvatarCropPopup";

// // const fileTypes = ["JPG", "PNG"];

// function AvatarSelect() {
//     // const [file, setFile] = useState<File>();

//     // const handleChange = (file: File) => {
//     //     setFile(file);
//     //     setIsModalOpen(true)
//     //     console.log(file);
//     // };

//     // const [isModalOpen, setIsModalOpen] = useState(false)

//     // const closeModal = () => {
//     //     setIsModalOpen(false)
//     // }

//     // const openModal = () => {
//     //     setIsModalOpen(true)
//     // }

//     return (
//         <div>
//             <FileUploader className={styles.labell} label='Upload or Drop' handleChange={handleChange} name="file" types={fileTypes} />
//             {isModalOpen && <AvatarCropPopup file={file} closeModal={closeModal}  />}
//         </div>
//     );
// }

// export default AvatarSelect;