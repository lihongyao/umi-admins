import { useQuery } from '@/hooks';
import mammoth from 'mammoth';
import React, { useEffect, useState } from 'react';
const LoadDocs: React.FC = () => {
  const { doc_name } = useQuery<{ doc_name: string }>();
  const [content, setContent] = useState<string>('');
  const loadDocxFile = async () => {
    try {
      // -- 使用 fetch 从 public 目录加载文件
      const response = await fetch(`/docs/${doc_name}.docx`);
      const arrayBuffer = await response.arrayBuffer();
      // -- 使用 mammoth 将 docx 文件解析为 HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      // -- 设置解析结果
      setContent(result.value);
    } catch (error) {
      console.error('Error fetching or converting file:', error);
    }
  };

  useEffect(() => {
    loadDocxFile();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default LoadDocs;
