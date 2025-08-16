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
import { UpdateUserInfo } from "@/redux/actions/ProfileActions";
import Loader from "@/components/common/Loader";

const EditInfoModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(UpdateUserInfo(form));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
          />
          <Input
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <Input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            type="password"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader /> : "Update Info"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfoModal;
