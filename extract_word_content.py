#!/usr/bin/env python3
"""
Word Document Content Extractor
Extracts text content from .docx files for processing
"""

import sys
import os
from pathlib import Path

def extract_docx_content(docx_path):
    """
    Extract text content from a .docx file
    """
    try:
        # Try using python-docx library first
        try:
            from docx import Document
            
            doc = Document(docx_path)
            content = []
            
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    content.append(paragraph.text.strip())
            
            return "\n".join(content)
            
        except ImportError:
            print("python-docx not available, trying alternative method...")
            
            # Alternative: try using zipfile to extract and parse XML
            import zipfile
            import xml.etree.ElementTree as ET
            
            with zipfile.ZipFile(docx_path, 'r') as docx:
                # Read the main document XML
                xml_content = docx.read('word/document.xml')
                root = ET.fromstring(xml_content)
                
                # Extract text from all text nodes
                text_content = []
                for elem in root.iter():
                    if elem.text:
                        text_content.append(elem.text)
                
                return "\n".join(text_content)
                
    except Exception as e:
        print(f"Error extracting content: {e}")
        return None

def main():
    # Find the Word document in the current directory
    current_dir = Path(".")
    docx_files = list(current_dir.glob("*.docx"))
    
    if not docx_files:
        print("No .docx files found in current directory")
        return
    
    # Use the first .docx file found
    docx_file = docx_files[0]
    print(f"Extracting content from: {docx_file}")
    
    content = extract_docx_content(docx_file)
    
    if content:
        print("\n" + "="*50)
        print("EXTRACTED CONTENT:")
        print("="*50)
        print(content)
        print("="*50)
        
        # Save to a text file for easier reading
        output_file = "extracted_content.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\nContent saved to: {output_file}")
        
    else:
        print("Failed to extract content")

if __name__ == "__main__":
    main()

