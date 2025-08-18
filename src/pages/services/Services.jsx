import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services() {
  return (
    <div className="overflow-hidden text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-2xl"
        >
          <h1 className="text-5xl font-bold mb-4">Our Website Thoughts</h1>
          <p className="text-lg">
            We don’t just build a platform — we build ideas, visions, and a new
            way to connect.
          </p>
        </motion.div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
          <p className="text-lg text-gray-600">
            We believe in creating a digital space where creativity meets
            innovation. Our mission is to transform simple ideas into powerful
            experiences that inspire users worldwide.
          </p>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Makes Us Unique</h2>
          <p className="text-gray-600">
            Key features and principles of our website thoughts
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Innovation",
              desc: "Fresh ideas to change the digital experience.",
            },
            { title: "Community", desc: "A place where users feel connected." },
            {
              title: "Simplicity",
              desc: "Designs that are easy to use and navigate.",
            },
            { title: "Creativity", desc: "Pushing boundaries of imagination." },
            { title: "Trust", desc: "Secure and reliable experiences." },
            {
              title: "Growth",
              desc: "Helping users and businesses expand digitally.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { num: "10K+", label: "Ideas Shared" },
            { num: "5K+", label: "Happy Users" },
            { num: "50+", label: "Projects" },
            { num: "99%", label: "Positive Feedback" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg"
            >
              <h3 className="text-4xl font-bold text-blue-600">{stat.num}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">Join Our Journey</h2>
          <p className="mb-6">
            Be part of our growing community and share your thoughts to inspire
            others.
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow hover:shadow-lg transition">
            Get Started
          </button>
        </motion.div>
      </section>
    </div>
  );
}
