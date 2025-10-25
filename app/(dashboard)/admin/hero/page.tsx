"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";

const AdminHeroPage = () => {
  const [form, setForm] = useState<{ image?: string; heading?: string; description?: string; buyNowUrl?: string; learnMoreUrl?: string; productId?: string }>({});
  const [allProducts, setAllProducts] = useState<Array<{id:string; title:string}>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/consolidated/hero').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      if (mounted && data) setForm(data);
    }).catch(() => {});
    apiClient.get('/api/products?mode=admin', { cache: 'no-store' }).then(async (res) => {
      if (!res.ok) return;
      const list = await res.json();
      if (mounted && Array.isArray(list)) setAllProducts(list.map((p:any)=>({id:p.id, title:p.title})));
    }).catch(()=>{});
    return () => { mounted = false };
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    try {
      const res = await apiClient.post("/api/main-image", formData);
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data?.filename }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const saveHero = async () => {
    setSaving(true);
    try {
      const res = await apiClient.post('/api/consolidated/hero', form);
      if (!res.ok) throw new Error("Save failed");
      toast.success("Hero saved");
    } catch {
      toast.error("Failed to save hero");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Hero Section</h1>
        <div className="mt-2">
          <label className="form-control w-full max-w-sm">
            <div className="label"><span className="label-text">Hero Image</span></div>
            <input type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-sm" onChange={(e:any)=>{const f=e.target.files?.[0]; if(f) uploadImage(f);}} />
          </label>
          {form.image && <Image src={`/${form.image}`} alt="hero" width={140} height={140} className="mt-2 w-auto h-auto" />}
        </div>
        <div>
          <label className="form-control w-full max-w-sm">
            <div className="label"><span className="label-text">Select Product to feature</span></div>
            <select className="select select-bordered" value={form.productId || ""} onChange={(e)=> setForm({...form, productId: e.target.value})}>
              <option value="">None</option>
              {allProducts.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}
            </select>
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-lg">
            <div className="label"><span className="label-text">Main Heading</span></div>
            <input type="text" className="input input-bordered w-full" value={form.heading || ""} onChange={(e)=>setForm({...form, heading: e.target.value})} />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-lg">
            <div className="label"><span className="label-text">Short Description</span></div>
            <textarea className="textarea textarea-bordered h-24" value={form.description || ""} onChange={(e)=>setForm({...form, description: e.target.value})} />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-lg">
            <div className="label"><span className="label-text">Buy Now URL</span></div>
            <input type="text" className="input input-bordered w-full" value={form.buyNowUrl || ""} onChange={(e)=>setForm({...form, buyNowUrl: e.target.value})} />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-lg">
            <div className="label"><span className="label-text">Learn More URL (optional)</span></div>
            <input type="text" className="input input-bordered w-full" value={form.learnMoreUrl || ""} onChange={(e)=>setForm({...form, learnMoreUrl: e.target.value})} />
          </label>
        </div>
        <div>
          <button onClick={saveHero} disabled={saving} className="uppercase bg-blue-500 px-10 py-3 text-base border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600">{saving? 'Saving...':'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroPage;


