import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as yaml from 'js-yaml';

export default function YamlEditor() {
  const [yamlContent, setYamlContent] = useState('');
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 📥 YAML 파일 fetch
  useEffect(() => {
    fetch('/values-milvus.yaml')
      .then((res) => res.text())
      .then((text) => {
        setYamlContent(text);
        try {
          setParsed(yaml.load(text));
        } catch (e: any) {
          setError(e.message);
        }
      })
      .catch((err) => setError('YAML 파일을 불러오는 데 실패했습니다.'));
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setYamlContent(value || '');
    try {
      const parsedYaml = yaml.load(value || '');
      setParsed(parsedYaml);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ height: '90vh' }}>
      <Editor
        height="80%"
        defaultLanguage="yaml"
        value={yamlContent}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{ minimap: { enabled: false } }}
      />
      {error && <p style={{ color: 'red' }}>YAML 파싱 오류: {error}</p>}
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        {JSON.stringify(parsed, null, 2)}
      </pre>
    </div>
  );
}