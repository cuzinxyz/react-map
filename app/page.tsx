"use client"

import { Suspense } from "react"
import BasicComponents from "@/components/01-basic-components"
import JSXExamples from "@/components/02-jsx-examples"
import PropsExample from "@/components/03-props-example"
import StateExample from "@/components/04-state-example"
import EventHandling from "@/components/05-event-handling"
import ConditionalRendering from "@/components/06-conditional-rendering"
import ListsAndKeys from "@/components/07-lists-and-keys"
import FormsControlled from "@/components/08-forms-controlled"
import UseEffectExample from "@/components/09-useeffect-example"
import UseContextExample from "@/components/10-usecontext-example"
import UseReducerExample from "@/components/11-usereducer-example"
import CustomHooksExample from "@/components/12-custom-hooks-example"
import ClassComponentLifecycle from "@/components/13-class-component-lifecycle"
import ErrorBoundaryExample from "@/components/14-error-boundary-example"
import RefsExample from "@/components/15-refs-example"
import MemoizationExample from "@/components/16-memoization-example"
import HigherOrderComponent from "@/components/17-higher-order-component"
import RenderPropsExample from "@/components/18-render-props-example"
import PortalsExample from "@/components/19-portals-example"
import SuspenseLazyExample from "@/components/20-suspense-lazy-example"
import ConcurrentFeaturesExample from "@/components/21-concurrent-features-example"
import AdvancedHooksExample from "@/components/22-advanced-hooks-example"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">React.js Comprehensive Learning App</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ứng dụng demo đầy đủ các kiến thức React từ cơ bản đến nâng cao
          </p>
        </header>

        <div className="space-y-8">
          {/* Basic Concepts */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">1. Kiến thức cơ bản</h2>
            <div className="grid gap-6">
              <BasicComponents />
              <JSXExamples />
              <PropsExample name="React Developer" age={25} />
              <StateExample />
              <EventHandling />
              <ConditionalRendering />
              <ListsAndKeys />
              <FormsControlled />
            </div>
          </section>

          {/* Intermediate Concepts */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">2. Kiến thức trung cấp</h2>
            <div className="grid gap-6">
              <UseEffectExample />
              <UseContextExample />
              <UseReducerExample />
              <CustomHooksExample />
              <ClassComponentLifecycle />
              <ErrorBoundaryExample />
              <RefsExample />
              <MemoizationExample />
            </div>
          </section>

          {/* Advanced Concepts */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">3. Kiến thức nâng cao</h2>
            <div className="grid gap-6">
              <HigherOrderComponent />
              <RenderPropsExample />
              <PortalsExample />
              <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                <SuspenseLazyExample />
              </Suspense>
              <ConcurrentFeaturesExample />
              <AdvancedHooksExample />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
