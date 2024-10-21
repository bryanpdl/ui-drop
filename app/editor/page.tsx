"use client";

import { Suspense } from "react";
import dynamic from 'next/dynamic';

const EditorContent = dynamic(() => import('@/components/EditorContent'), { ssr: false });

export default function EditorPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <EditorContent />
      </Suspense>
    );
  }
