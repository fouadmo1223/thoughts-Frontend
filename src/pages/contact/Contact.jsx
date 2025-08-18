import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react"; // icons

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Hero */}
      <section className="text-center py-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          We'd love to hear from you! Reach out with any questions, feedback, or
          collaboration ideas.
        </motion.p>
      </section>

      {/* Contact Info */}
      {/* Contact Info */}
      <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-12">
        {[
          {
            icon: <Mail className="w-8 h-8 text-indigo-600" />,
            title: "Email",
            desc: "fm0850020@gmail.com",
            link: "mailto:fm0850020@gmail.com",
          },
          {
            icon: <Phone className="w-8 h-8 text-indigo-600" />,
            title: "Phone",
            desc: "+0201016218389",
            link: "tel:+201016218389",
          },
          {
            icon: <MapPin className="w-8 h-8 text-indigo-600" />,
            title: "Address",
            desc: "El Mansoura, Egypt",
            link: "https://www.google.com/maps?q=El+Mansoura,+Egypt",
          },
        ].map((item, idx) => (
          <motion.a
            href={item.link}
            target={item.title === "Address" ? "_blank" : "_self"}
            rel="noopener noreferrer"
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center block hover:shadow-2xl transition"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.a>
        ))}
      </section>
      <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-12">
        {[
          {
            icon: <Mail className="w-8 h-8 text-indigo-600" />,
            title: "Email",
            desc: "fm0850020@gmail.com",
          },
          {
            icon: <Phone className="w-8 h-8 text-indigo-600" />,
            title: "Phone",
            desc: "+0201016218389",
          },
          {
            icon: <MapPin className="w-8 h-8 text-indigo-600" />,
            title: "Address",
            desc: "El mansoura , Egypt",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Send Us a Message{" "}
            <span className="text-gray-400">(disabled for now)</span>
          </h2>
          <form className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* Google Map
      <section className="w-full h-[400px]">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24170.57627503025!2d-74.0060159!3d40.7127281"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section> */}
    </div>
  );
};

export default Contact;
