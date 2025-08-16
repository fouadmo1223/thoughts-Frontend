import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfileImage } from "@/redux/actions/ProfileActions";
import Loader from "@/components/common/Loader";

const EditImageModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    await dispatch(UpdateProfileImage(image));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="file" onChange={handleFileChange} accept="image/*" />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader /> : "Update Image"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditImageModal;
