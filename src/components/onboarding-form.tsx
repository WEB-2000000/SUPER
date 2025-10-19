'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Sparkles, Rocket } from 'lucide-react';
import type { User } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'يجب أن يكون الاسم من حرفين على الأقل.' }).max(50, { message: 'يجب ألا يزيد الاسم عن 50 حرفًا.' }),
  age: z.coerce
    .number()
    .int()
    .min(10, { message: 'يجب أن يكون عمرك 10 سنوات على الأقل.' })
    .max(100, { message: 'يجب أن يكون عمرك 100 عام أو أقل.' }),
  goal: z.string().min(10, { message: 'يجب أن يكون الهدف من 10 أحرف على الأقل.' }).max(200, { message: 'يجب ألا يزيد الهدف عن 200 حرف.' }),
});

type OnboardingFormProps = {
  open: boolean;
  setUser: (user: User) => void;
  generateRoutine: () => Promise<void>;
  isGeneratingRoutine: boolean;
};

const OnboardingForm: React.FC<OnboardingFormProps> = ({
  open,
  setUser,
  generateRoutine,
  isGeneratingRoutine,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 18,
      goal: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setUser(values);
    await generateRoutine();
  };

  const isWorking = isSubmitting || isGeneratingRoutine;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Rocket className="w-10 h-10 text-primary" />
            </div>
          <DialogTitle className="font-headline text-3xl text-primary">
            مرحباً بك في Super Charge
          </DialogTitle>
          <DialogDescription className="text-base">
            لنقم بإعداد ملفك الشخصي. ستساعدنا هذه المعلومات في تخصيص تجربتك وتحفيزك.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسمك..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العمر</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="أدخل عمرك..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ما هو هدفك الأساسي؟</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="على سبيل المثال: تعلم البرمجة، ممارسة الرياضة يوميًا..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full mt-4" disabled={isWorking}>
              {isWorking ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? (isGeneratingRoutine ? 'جاري إنشاء خطتك...' : 'جاري الحفظ...') : 'ابدأ رحلتك نحو النجاح'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingForm;
