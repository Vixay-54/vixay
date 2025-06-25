'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';

export default function Home() {

const [imageUrl, setImageUrl] = useState<string | null>(null);

const [uploading, setUploading] = useState(false);

const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {

const file = event.target.files?.[0];

if (!file) return;

const filePath = `uploads/${Date.now()}-${file.name}`;

setUploading(true);

const { error } = await supabase.storage

.from('images')

.upload(filePath, file, {

cacheControl: '3600',

upsert: true,

});

if (error) {

console.error('Upload failed:', error.message);

setUploading(false);

return;

}



const { data } = supabase.storage.from('images').getPublicUrl(filePath);

setImageUrl(data.publicUrl);

setUploading(false);

};

return (

<div className="min-h-screen flex flex-col items-center justify-center gap-6
p-6">

<h1 className="text-2xl font-semibold">🖼️ Image Upload Demo</h1>

<input

type="file"

accept="image/*"

onChange={handleUpload}

disabled={uploading}

className="file:border file:rounded file:px-4 file:py-2"

/>

{uploading && <p>Uploading...</p>}

{imageUrl && (

<img

src={imageUrl}

alt="Uploaded"

className="max-w-sm rounded shadow-lg mt-4"

/>

)}

</div>

);

}