import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ImagePlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const AddListingPage = () => {
  const { listings, setListings, currentUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !stock) {
      toast.error("Please fill in all fields");
      return;
    }
    const newListing = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imagePreview || "",
      seller: currentUser.username,
      sellerId: currentUser.id,
    };
    setListings([newListing, ...listings]);
    toast.success("Listing added successfully!");
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Add Listing" showBack />
      <div className="px-4 py-6 space-y-4">
        {/* Image Upload */}
        <label className="block cursor-pointer">
          <div className="w-full h-48 rounded-xl border-2 border-dashed border-primary/30 bg-primary-light flex flex-col items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImagePlus className="w-10 h-10 text-primary/50 mb-2" />
                <p className="text-sm text-muted-foreground">Upload plant photo</p>
              </>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Plant Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tomato"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Price per kg (RM)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="0.00"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Stock (kg)</label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="0"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mt-4"
        >
          Add Listing
        </button>
      </div>
    </div>
  );
};

export default AddListingPage;
