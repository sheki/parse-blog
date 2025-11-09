import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const journalSteps = [
  {
    step: 1,
    title: 'Name the belief.',
    prompt: 'Pick something you feel strongly about. Just name it. Don’t justify it yet.',
    example: 'Example: “People should always keep their promises.”',
  },
  {
    step: 2,
    title: 'Notice the feeling attached to it.',
    prompt: 'When this belief is challenged, do I get angry? Hurt? Protective? Proud? Name the emotion in plain language.',
    example: 'This helps you see this isn’t just an idea — it’s tied to your identity.',
  },
  {
    step: 3,
    title: 'Where did I learn this?',
    prompt: 'Not to accuse, but to trace lineage. A parent? A cultural value? A teacher? A role model? A past wound?',
    example: 'This is about history, not blame.',
  },
  {
    step: 4,
    title: 'What does this belief do for me?',
    prompt: 'Does it: Make me feel safe? Give me direction? Help me avoid vulnerability? Help me connect with people? Protect me from being hurt again?',
    example: 'This reveals what it’s holding up.',
  },
  {
    step: 5,
    title: 'When is this belief true?',
    prompt: "Don't ask if it's always true. Ask where it works well.",
    example: 'Examples: Keeping promises builds trust. Being assertive protects boundaries. Independence prevents dependency.',
  },
  {
    step: 6,
    title: 'When does this belief harm me?',
    prompt: 'No self-attack. No shame. Just look gently.',
    example: 'Examples: “Always keeping promises” → I never allow myself to change. “Be strong, don’t need anyone” → I end up isolated.',
  },
];

const JournalApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted || currentStep >= journalSteps.length) {
      return;
    }

    if (timeLeft === 0) {
      setCurrentStep((prevStep) => prevStep + 1);
      setTimeLeft(60);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isStarted, currentStep]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setTimeLeft(60);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setAnswers(Array(6).fill(''));
    setTimeLeft(60);
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">6-Minute Belief Reflection</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Ready to explore your beliefs? You'll have 1 minute for each of the 6 steps.</p>
            <Button onClick={handleStart}>Start Journaling</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep >= journalSteps.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Your Belief Reflection</CardTitle>
          </CardHeader>
          <CardContent>
            {journalSteps.map((step, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 p-2 border rounded bg-gray-50 dark:bg-gray-800">{answers[index] || 'No answer'}</p>
              </div>
            ))}
            <div className="text-center mt-6">
              <Button onClick={handleRestart}>Start Over</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const step = journalSteps[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Step {step.step}: {step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg">{step.prompt}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{step.example}</p>
          </div>
          <div className="my-4">
            <Progress value={(timeLeft / 60) * 100} className="w-full" />
            <p className="text-center text-sm mt-1">{timeLeft} seconds remaining</p>
          </div>
          <Textarea
            value={answers[currentStep]}
            onChange={handleAnswerChange}
            placeholder="Your thoughts..."
            className="min-h-[200px] text-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalApp;
