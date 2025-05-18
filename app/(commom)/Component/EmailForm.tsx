import React, { useState, FC, FormEvent } from 'react';
import { resizeFileToBase64 } from '../ImgResizer';
import Image from 'next/image';

interface EmailFormProps {
  initialEmail?: string;
  onClose: () => void;
  onSend: (data: { emailAddress: string; emailTitle: string; emailContent: string, base64Img:string }) => void;
}

const EmailForm: FC<EmailFormProps> = ({ initialEmail = '', onClose, onSend }) => {
    const [emailAddress, setEmail] = useState<string>(initialEmail);
    const [emailTitle, setTitle] = useState<string>('');
    const [emailContent, setContent] = useState<string>('');

    const [imgFile, setImgFile] = useState<File|undefined>();
    const [base64Img, setImgString] = useState<string>("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSend({ emailAddress, emailTitle, emailContent, base64Img });
    };

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event
        ) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setImgFile(file);
            if (file) {
            try {
                const base64String = await resizeFileToBase64(file, 1200, 1200) as string;
                setImgString(base64String);
                } catch (error) {
                console.error("파일 변환 오류:", error);
            }
            }
        }
        };

    return (
        <div style={styles.overlay}>
        <div style={styles.modal}>
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">받는 사람 이메일:</label><br />
                <input
                id="email"
                type="email"
                value={emailAddress}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
                />
            </div>
            <div>
                <label htmlFor="title">제목:</label><br />
                <input
                id="title"
                type="text"
                value={emailTitle}
                onChange={e => setTitle(e.target.value)}
                required
                style={styles.input}
                />
            </div>
            <div>
                <label htmlFor="content">내용:</label><br />
                <textarea
                id="content"
                value={emailContent}
                onChange={e => setContent(e.target.value)}
                required
                rows={5}
                style={styles.textarea}
                />
            </div>
            <div>
                <input
                    className="border border-slate-500  mt-5"
                    onChange={handleFileChange}
                    type="file"
                    accept=".jpg, .jpeg, .png, .gif, .webp"
                /> 
                <div className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px] mt-5">
                    <Image className="inner-img" width={150} height={150} src={base64Img} alt="no imgage"/>
                </div>
            </div>
            <div className='w-full flex justify-around items-center'>
                <button className='greenBtn' type="submit">보내기</button>
                <button className='cancelBtn' onClick={onClose} >닫기</button>
            </div>
            </form>
        </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: 400,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 8, right: 8,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: 18,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  sendBtn: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default EmailForm;
