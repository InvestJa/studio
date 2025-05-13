"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have Textarea
import type { Client } from "@/types";
import { Icons } from "../icons";
import React from "react";

const clientFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  phone: z.string().min(10, { message: "O telefone deve ter pelo menos 10 dígitos." }),
  document: z.string().min(11, { message: "O documento (CPF/CNPJ) é obrigatório." }),
  loanAmount: z.coerce.number().positive({ message: "O valor do empréstimo deve ser positivo." }),
  loanTerm: z.coerce.number().int().positive({ message: "O prazo deve ser um número inteiro positivo." }),
  interestRate: z.coerce.number().min(0, { message: "A taxa de juros não pode ser negativa." }),
  // outstandingBalance can be derived or set initially equal to loanAmount
  // paymentHistory will be managed separately
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Client | null;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClientForm({ initialData, onSubmit, onCancel, isSubmitting }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          document: initialData.document,
          loanAmount: initialData.loanAmount,
          loanTerm: initialData.loanTerm,
          interestRate: initialData.interestRate,
        }
      : {
          name: "",
          email: "",
          phone: "",
          document: "",
          loanAmount: 0,
          loanTerm: 0,
          interestRate: 0,
        },
  });

  const handleSubmit = async (values: ClientFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: João da Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Ex: joao.silva@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: (11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123.456.789-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <h3 className="text-lg font-semibold border-t pt-4 mt-6">Detalhes do Empréstimo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Empréstimo (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 5000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo (meses)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="Ex: 12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Juros (% a.m.)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 2.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Salvar Alterações" : "Adicionar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
