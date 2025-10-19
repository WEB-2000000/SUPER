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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';
import type { User } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'يجب أن يكون الاسم من حرفين على الأقل.' }),
  age: z.coerce
    .number()
    .int()
    .min(10, { message: 'يجب أن يكون عمرك 10 سنوات على الأقل.' })
    .max(100, { message: 'يجب أن يكون عمرك 100 عام أو أقل.' }),
  goal: z.string().min(10, { message: 'يجب أن يكون الهدف من 10 أحرف على الأقل.' }),
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
    // The dialog will close automatically when the `open` prop becomes false
    // No need to setIsSubmitting(false) as the component will be unmounted or hidden
  };

  const isWorking = isSubmitting || isGeneratingRoutine;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            مرحباً بك في Super Charge
          </DialogTitle>
          <DialogDescription>
            لنقم بإعداد ملفك الشخصي. ستساعدنا هذه المعلومات في تخصيص تجربتك.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="اسمك..." {...field} />
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
                    <Input type="number" placeholder="عمرك..." {...field} />
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
                    <Input placeholder="على سبيل المثال، تعلم لغة جديدة، الحصول على لياقة..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isWorking}>
              {isWorking ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? (isGeneratingRoutine ? 'جارٍ إنشاء خطتك...' : 'جارٍ الحفظ...') : 'ابدأ رحلتك'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingForm;
