import React, { useState } from "react";
import { ArrowLeft, ArrowUp, ChevronDown, CheckCircle2, MessageSquareText, ShieldCheck, BanIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const workFunctions = [
  "Product management",
  "Engineering",
  "Human resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Data science",
  "Design",
  "Legal",
  "Other",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const [step, setStep] = useState(0);
  const [planTab, setPlanTab] = useState<"pro" | "team">("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState("");
  const [workFunction, setWorkFunction] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const teamNameError = teamName.length > 0 && (teamName.length < 3 || teamName.length > 60);

  const maxStep = isUpgrade ? 3 : 6;
  const next = () => {
    if (isUpgrade && step === 3) {
      navigate("/team-feature");
      return;
    }
    setStep((s) => Math.min(s + 1, maxStep));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col">
      {/* Step 0: Choose your plan */}
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-start px-6 py-16 overflow-y-auto">
          <h1 className="text-3xl font-normal text-foreground mb-3">Choose your plan</h1>
          <p className="text-sm text-muted-foreground mb-8 text-center whitespace-nowrap">
            {planTab === "pro"
              ? "Get access to premium AI models, image generation, file analysis, and much more."
              : "You must have a work domain to select the Team plan."}
          </p>

          {/* Pro / Team toggle */}
          <div className="flex items-center border border-border rounded-full mb-10">
            <button
              onClick={() => setPlanTab("pro")}
              className={`px-5 py-2 text-sm rounded-full transition-colors ${
                planTab === "pro" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Pro
            </button>
            <button
              onClick={() => setPlanTab("team")}
              className={`px-5 py-2 text-sm rounded-full transition-colors ${
                planTab === "team" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Team
            </button>
          </div>

          {/* Pro tab content */}
          {planTab === "pro" && (
            <div className="flex gap-8 max-w-[900px] w-full">
              {/* Feature comparison */}
              <div className="flex-1 border border-border rounded-xl p-6 bg-background">
                <div className="grid grid-cols-[1fr_60px_60px] gap-y-4 items-center">
                  <div />
                  <span className="text-xs text-muted-foreground text-center font-normal">FREE</span>
                  <span className="text-xs text-muted-foreground text-center font-normal">PRO</span>

                  {[
                    { icon: "🌀", label: "Access to the cutting-edge OpenAI GPT-5.4 model" },
                    { icon: "🌀", label: "Access to OpenAI GPT-5, GPT-5.1" },
                    { icon: "🔵", label: "Access to DeepSeek" },
                    { icon: "💎", label: "Access to Gemini 3.1 Pro" },
                    { icon: "✳️", label: "Access to Claude Sonnet 4.6" },
                    { icon: "🌐", label: "Web search – instant web scanning and real-time web intelligence" },
                    { icon: "🖼️", label: "Generate images with artificial intelligence" },
                    { icon: "🔍", label: "AI Search Engine" },
                    { icon: "📄", label: "Analyze PDFs, documents, images, and more" },
                  ].map((feat) => (
                    <React.Fragment key={feat.label}>
                      <div className="flex items-start gap-3">
                        <span className="text-base shrink-0">{feat.icon}</span>
                        <span className="text-sm text-foreground">{feat.label}</span>
                      </div>
                      <span className="text-center text-muted-foreground">✗</span>
                      <span className="text-center text-green-500">✓</span>
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-6 text-center">
                  Trusted by over 700,000 people. ⭐⭐⭐⭐⭐
                </p>
              </div>

              {/* Pricing card */}
              <div className="w-[340px] shrink-0 border border-border rounded-xl p-6 bg-background">
                <h2 className="text-xl font-normal text-foreground mb-2">Upgrade to PRO</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Get access to premium AI models, image generation, file analysis, and much more.
                </p>

                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`w-full border rounded-xl p-3 text-left transition-colors ${
                      billingCycle === "monthly" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          billingCycle === "monthly" ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {billingCycle === "monthly" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm text-foreground">Full Access 7 Days</span>
                      </div>
                      <span className="text-lg font-normal text-foreground">€1.00</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingCycle("annually")}
                    className={`w-full border rounded-xl p-3 text-left transition-colors ${
                      billingCycle === "annually" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          billingCycle === "annually" ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {billingCycle === "annually" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm text-foreground">Quarterly</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 45%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-normal text-foreground">€16.67</span>
                        <span className="text-xs text-muted-foreground block">per month</span>
                      </div>
                    </div>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Get a 7-day trial for just €1.00. After the trial, we'll charge €29.99 every month until you cancel.
                </p>

                <div className="flex justify-between text-sm font-normal text-foreground mb-4">
                  <span>Total due today</span>
                  <span>€1.00</span>
                </div>

                <div className="space-y-2">
                  <button onClick={next} className="w-full py-3 rounded-xl bg-[#FFC439] text-foreground text-sm font-normal hover:opacity-90 transition-opacity">
                    PayPal
                  </button>
                  <button onClick={next} className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity">
                    Buy with  Pay
                  </button>
                  <button onClick={next} className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <span>G Pay</span>
                  </button>
                  <button onClick={next} className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-normal hover:opacity-90 transition-opacity">
                    Credit or debit card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team tab content */}
          {planTab === "team" && (
            <div className="max-w-[500px] w-full">
              <div className="border border-border rounded-xl p-6 bg-background">
                <div className="text-4xl mb-4">👥</div>
                <h2 className="text-xl font-normal text-foreground mb-3">Team</h2>
                <p className="text-lg font-normal text-foreground">
                  USD {billingCycle === "monthly" ? "30" : "25"} <span className="text-sm text-muted-foreground">/ month + tax</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Per member, 5 minimum
                </p>

                {/* Billing toggle for team */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 border rounded-lg px-3 py-2 text-xs transition-colors ${
                      billingCycle === "monthly" ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annually")}
                    className={`flex-1 border rounded-lg px-3 py-2 text-xs transition-colors ${
                      billingCycle === "annually" ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    Annually · <span className="text-primary">Save 20%</span>
                  </button>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Pro",
                    "More usage than Pro",
                    "Central billing and administration",
                    "Early access to collaboration features",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={next}
                  className="w-full px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
                >
                  Create Team Account
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-8">
            Subscription auto-renews until canceled.{" "}
            <span className="underline cursor-pointer">Learn more</span>
          </p>
        </div>
      )}

      {/* Step 1: Billing / Order details */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center px-6 py-16">
          <h1 className="text-3xl font-normal text-foreground mb-8">Choose your plan</h1>

          {/* Billing toggle */}
          <div className="flex gap-4 max-w-[600px] w-full mb-6">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`flex-1 border rounded-xl p-4 text-left transition-colors ${
                billingCycle === "monthly" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  billingCycle === "monthly" ? "border-primary" : "border-muted-foreground"
                }`}>
                  {billingCycle === "monthly" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-normal text-foreground">Monthly</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">$125.00/month</p>
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`flex-1 border rounded-xl p-4 text-left transition-colors ${
                billingCycle === "annually" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  billingCycle === "annually" ? "border-primary" : "border-muted-foreground"
                }`}>
                  {billingCycle === "annually" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-normal text-foreground">Annually</span>
                <span className="text-xs text-primary ml-auto">Save 20%</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">$1,200.00/year</p>
            </button>
          </div>

          {/* Order details */}
          <div className="max-w-[600px] w-full border border-border rounded-xl p-6 bg-background mb-6">
            <h2 className="text-sm font-normal text-foreground mb-4">Order details</h2>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Standard seats</span>
              <span>(5 seats minimum applied)</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>× $25 / standard seat / month</span>
              <span>$125.00</span>
            </div>
            <div className="border-t border-border pt-3 space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>$125.00</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-normal text-foreground mt-3 pt-3 border-t border-border">
              <span></span>
              <span>$125.00 / month</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="max-w-[600px] w-full border border-border rounded-xl p-6 bg-background">
            <h2 className="text-sm font-normal text-foreground mb-4">Payment method</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Full name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Country or region</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 appearance-none">
                  <option>Armenia</option>
                  <option>Italy</option>
                  <option>United States</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Address line 1</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <button
                onClick={next}
                className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Order confirmation */}
      {step === 2 && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[500px] w-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-normal text-foreground mb-3">You're all set!</h1>
            <p className="text-sm text-muted-foreground mb-2">
              Your subscription has been confirmed.
            </p>
            <div className="border border-border rounded-xl p-5 bg-background text-left mb-8 mt-6">
              <h2 className="text-sm font-normal text-foreground mb-3">Order summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Plan</span>
                  <span className="text-foreground">Team</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Billing</span>
                  <span className="text-foreground">{billingCycle === "monthly" ? "Monthly" : "Annually"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span className="text-foreground">5</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-normal text-foreground">
                  <span>Total</span>
                  <span>{billingCycle === "monthly" ? "$125.00 / month" : "$1,200.00 / year"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={next}
              className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Set up your organization */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 py-10">
          <div className="flex items-center justify-between mb-12">
            <button onClick={back} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <span className="font-normal">use.ai</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{teamName || "..."}</span>
            </div>
            <div className="w-9" />
          </div>

          <div className="max-w-[600px] mx-auto w-full">
            <h1 className="text-2xl font-normal text-foreground mb-3">Let's set-up your organization</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Team plans are best for groups up to 150 people. Choose a team name that invited members will easily recognize.
            </p>

            <div className={`border rounded-xl p-4 ${teamNameError ? "border-primary ring-2 ring-primary/20" : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"}`}>
              <label className="text-xs text-muted-foreground block mb-1">My team is named</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-foreground"
                autoFocus
              />
              {teamNameError && (
                <p className="text-xs text-primary mt-1">Your team name must be between 3 and 60 characters</p>
              )}
            </div>

            <button
              onClick={next}
              disabled={teamName.length < 3}
              className={`mt-6 px-5 py-2.5 rounded-lg text-sm font-normal transition-opacity ${
                teamName.length >= 3 && !teamNameError
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground opacity-50"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Welcome */}
      {step === 4 && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[600px] w-full">
            <div className="text-3xl mb-6">✺</div>
            <h1 className="text-3xl font-normal text-foreground mb-4">Hey there, I'm Use.ai.</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your AI assistant for <span className="text-primary italic">RubyLabs</span>, here to help with working, imagining, and deep thinking.
            </p>

            <p className="text-sm text-foreground mb-6">Here's a few things you should know about me:</p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <MessageSquareText size={28} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-normal text-foreground mb-1">Ask me anything</p>
                  <p className="text-sm text-muted-foreground">Chat with me about anything from simple asks to complex ideas! Guardrails keep our chat safe.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck size={28} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-normal text-foreground mb-1">Approved for your workflow</p>
                  <p className="text-sm text-muted-foreground">I'm approved for use with your company data and can integrate with your company tools.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <BanIcon size={28} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-normal text-foreground mb-1">Ad-free chats</p>
                  <p className="text-sm text-muted-foreground">I won't show you ads. My focus is being genuinely helpful to you.</p>
                </div>
              </div>
            </div>

            <button
              onClick={next}
              className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
            >
              I understand
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Enter name */}
      {step === 5 && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[600px] w-full">
            <div className="text-3xl mb-6">✺</div>
            <p className="text-lg font-normal text-foreground mb-6">Before we get started, what should I call you?</p>

            <div className="flex items-center gap-2 border border-border rounded-full px-4 py-3 bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <button
                onClick={next}
                disabled={!userName.trim()}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Select work function */}
      {step === 6 && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[600px] w-full">
            <div className="text-3xl mb-6">✺</div>
            <p className="text-lg font-normal text-foreground mb-6">
              Good to meet you, {userName || "there"}. Which team are you on?
            </p>

            <div className="relative mb-6">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-xl bg-background text-sm text-foreground hover:bg-accent/50 transition-colors"
              >
                <span className={workFunction ? "text-foreground" : "text-muted-foreground"}>
                  {workFunction || "Select work function"}
                </span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-auto min-w-[220px] bg-background border border-border rounded-xl shadow-lg py-2 z-10">
                  {workFunctions.map((fn) => (
                    <button
                      key={fn}
                      onClick={() => {
                        setWorkFunction(fn);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/team-feature")}
              disabled={!workFunction}
              className="px-5 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm font-normal disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              Go team
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
