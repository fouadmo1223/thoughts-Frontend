import React, { useRef, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const categories = [
  "Technology",
  "Lifestyle",
  "Education",
  "Business",
  "Health",
  "Travel",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
  category: Yup.string()
    .max(100, "Category cannot exceed 100 characters")
    .required("Category is required"),
});

export const CreatePost = () => {
  const [image, setImage] = useState(null);
  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = {
        ...values,
        image: image?.file || null,
      };
      console.log("Form Data Submitted:", formData);
      // You can send formData to backend using Axios or Fetch
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 3,
          px: { xs: 3, sm: 6 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Create New Post
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} width={"100%"}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12} width={"100%"}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12} width={"100%"}>
            <FormControl
              fullWidth
              required
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.category && formik.errors.category}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} width={"100%"}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Image (Optional)
            </Typography>
            <Box
              onClick={() => inputRef.current.click()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#fafafa",
                position: "relative",
              }}
            >
              {image ? (
                <>
                  <Avatar
                    src={image.preview}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography>{image.file.name}</Typography>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <Delete />
                  </IconButton>
                </>
              ) : (
                <>
                  <PhotoCamera color="action" />
                  <Typography>Click to upload image</Typography>
                </>
              )}
            </Box>
            <input
              type="file"
              hidden
              ref={inputRef}
              accept="image/*"
              onChange={handleImageChange}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button type="submit" variant="contained" size="large">
              Submit Post
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
