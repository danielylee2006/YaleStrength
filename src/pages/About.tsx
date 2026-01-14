import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Target, Users, Shield, Trophy, Mail } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Trophy,
      title: "Track Your Progress",
      description:
        "Log your bench, squat, and deadlift PRs and watch yourself climb the rankings.",
    },
    {
      icon: Shield,
      title: "Verified Lifts",
      description:
        "All lifts are reviewed by our team to ensure fair competition and accurate records.",
    },
    {
      icon: Users,
      title: "Yale Community",
      description:
        "Connect with fellow Yale powerlifters, share tips, and push each other to new heights.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up with your Yale email to join the community.",
    },
    {
      step: "2",
      title: "Submit Your Lifts",
      description: "Record your lift and upload a video for verification.",
    },
    {
      step: "3",
      title: "Get Verified",
      description: "Our team reviews your submission within 24-48 hours.",
    },
    {
      step: "4",
      title: "Climb the Ranks",
      description: "Once verified, your lift appears on the leaderboard!",
    },
  ];

  const faqs = [
    {
      question: "Who can participate?",
      answer:
        "YaleStrength is open to all current Yale students, faculty, and staff with a valid Yale email address.",
    },
    {
      question: "What equipment is allowed?",
      answer:
        "We follow standard powerlifting federation rules in terms of equipment. Belts and wrist wraps are allowed. Elbow wraps, bench shirts, and slingshots are not allowed. ",
    },
    {
      question: "How are lifts verified?",
      answer:
        "Our team reviews each video submission to ensure proper form, full range of motion, and that the weight is clearly visible. Verification typically takes 24-48 hours.",
    },
    {
      question: "How is my form judged?",
      answer: (
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-foreground mb-1">Bench Press:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                The lifter's head, shoulders, and glutes should be in contact with the
                bench at all times.
              </li>
              <li>The bar must make contact with the chest.</li>
              <li>Minimal bounce off the chest is allowed</li>
              <li>
                The bar must be pressed to full lockout with elbows clearly
                extended.
              </li>
              <li>
                Excessive arching that removes glutes from the bench is not
                allowed.
              </li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Squat:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>High-bar and low-bar squat are both valid.</li>
              <li>
                The lifter's hip crease must be clearly below the top of the
                knee.
              </li>
              <li>
                Spotters may be present but may not touch the bar during the
                lift.
              </li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Deadlift:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                The bar must start fully on the ground (no elevated platforms
                under the plates)
              </li>
              <li>Conventional or sumo are both valid.</li>
              <li>
                The lifter must lift the bar to full lockout, standing upright
                with hips, knees, shoulders fully extended.
              </li>
              <li>
                Hitching, ramping, or resting the bar on the thighs is not
                allowed.
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      question: "Can I update my lifts?",
      answer:
        "Absolutely! Hit a new PR? Just submit a new video and we'll update your record once verified.",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">
            About YaleStrength
          </h1>
          <p className="text-lg text-muted-foreground">
            Building a community of strength at Yale, one lift at a time.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-16 max-w-3xl mx-auto transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Our Mission</h2>
                <p className="text-muted-foreground">
                  YaleStrength was created to foster a supportive community of
                  lifters at Yale. We believe in the power of friendly
                  competition to motivate and inspire. Whether you're just
                  starting your fitness journey or you're a seasoned lifter,
                  there's a place for you here. Our goal is to celebrate
                  progress at every level and create a platform where Yalies can
                  connect over their shared passion for strength training.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why YaleStrength?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-default"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:bg-primary/20">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center group cursor-default">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold text-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="transition-colors duration-200 hover:bg-muted/50 rounded-lg px-2"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact */}
        <Card className="max-w-xl mx-auto transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="text-center">
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or want to get involved? We'd love to
              hear from you!
            </p>
            <Button
              size="lg"
              className="gap-2 transition-transform duration-200 hover:scale-105"
              onClick={() =>
                (window.location.href = "mailto:daniel.lee.dyl27@yale.edu")
              }
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
