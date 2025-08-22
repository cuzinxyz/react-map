"use client"

import type React from "react"

import { useState } from "react"

interface FormData {
  name: string
  email: string
  age: number
  gender: string
  country: string
  hobbies: string[]
  bio: string
  newsletter: boolean
  terms: boolean
}

export default function FormsControlled() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: 18,
    gender: "",
    country: "",
    hobbies: [],
    bio: "",
    newsletter: false,
    terms: false,
  })

  const [errors, setErrors] = useState<Record<keyof FormData, string | undefined>>({} as Record<keyof FormData, string | undefined>)
  const [submitted, setSubmitted] = useState(false)

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle checkbox array (hobbies)
  const handleHobbyChange = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby) ? prev.hobbies.filter((h) => h !== hobby) : [...prev.hobbies, hobby],
    }))
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<keyof FormData, string | undefined> = {} as Record<keyof FormData, string | undefined>

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (formData.age < 18) newErrors.age = "Must be 18 or older"
    if (!formData.gender) newErrors.gender = "Please select gender"
    if (!formData.country) newErrors.country = "Please select country"
    if (!formData.terms) newErrors.terms = "You must accept terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setSubmitted(true)
      console.log("Form submitted:", formData)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      age: 18,
      gender: "",
      country: "",
      hobbies: [],
      bio: "",
      newsletter: false,
      terms: false,
    })
    setErrors({} as Record<keyof FormData, string | undefined>)
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">8. Forms & Controlled Components</h3>
        <div className="p-4 bg-green-50 rounded text-center">
          <h4 className="text-lg font-medium text-green-800 mb-2">Form Submitted Successfully!</h4>
          <div className="text-sm text-left bg-white p-3 rounded border">
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
          <button onClick={resetForm} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">
            Submit Another Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">8. Forms & Controlled Components</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded text-sm ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Number Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="18"
            max="100"
            className={`w-full px-3 py-2 border rounded text-sm ${errors.age ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        {/* Radio Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">Gender *</label>
          <div className="space-x-4">
            {["male", "female", "other"].map((gender) => (
              <label key={gender} className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleInputChange}
                  className="mr-1"
                />
                <span className="text-sm capitalize">{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Select Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded text-sm ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="vn">Vietnam</option>
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>

        {/* Checkboxes (Multiple) */}
        <div>
          <label className="block text-sm font-medium mb-2">Hobbies</label>
          <div className="space-y-2">
            {["Reading", "Gaming", "Sports", "Music", "Travel"].map((hobby) => (
              <label key={hobby} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hobbies.includes(hobby)}
                  onChange={() => handleHobbyChange(hobby)}
                  className="mr-2"
                />
                <span className="text-sm">{hobby}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Single Checkbox */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">Subscribe to newsletter</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">I accept the terms and conditions *</span>
          </label>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Form
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Form State Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium mb-2">Current Form State:</h4>
        <pre className="text-xs overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  )
}
