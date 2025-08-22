"use client"

import type React from "react"

interface UserProps {
  name: string
  age: number
  email?: string
  hobbies?: string[]
}

// Component with props
function UserCard({ name, age, email, hobbies }: UserProps) {
  return (
    <div className="p-3 bg-gray-50 rounded border">
      <h4 className="font-medium">User Information</h4>
      <p className="text-sm">Name: {name}</p>
      <p className="text-sm">Age: {age}</p>
      {email && <p className="text-sm">Email: {email}</p>}
      {hobbies && hobbies.length > 0 && <div className="text-sm">Hobbies: {hobbies.join(", ")}</div>}
    </div>
  )
}

// Component with children prop
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 border-2 border-dashed border-gray-300 rounded">
      <h4 className="text-sm font-medium mb-2">Container with children:</h4>
      {children}
    </div>
  )
}

// Default props example
function Greeting({ message = "Hello World!" }: { message?: string }) {
  return <p className="text-sm italic">{message}</p>
}

export default function PropsExample({ name, age }: { name: string; age: number }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">3. Props Example</h3>
      <div className="space-y-3">
        <UserCard name={name} age={age} email="developer@example.com" hobbies={["Coding", "Reading", "Gaming"]} />

        <Container>
          <p className="text-sm">This is children content</p>
          <Greeting />
          <Greeting message="Custom greeting!" />
        </Container>
      </div>
    </div>
  )
}
