"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import http from "@/http";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface RegisterProps {
  name?: string;
  email?: string;
  password?: string;
}
const Register = () => {
  const router = useRouter();
  const schema = Yup.object().shape({
    name: Yup.string().label("Nome é obrigatório").required("Digite um nome"),
    email: Yup.string()
      .email("Digite um E-mail válido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .required("Senha é obrigatória")
      .min(6, "Senha deve conter no minimo 6 digitos"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (customerData: RegisterProps) => {
    try {
      const response = await http.post(
        "/register",
        {
          name: customerData.name,
          email: customerData.email,
          password: customerData.password,
        },
        { validateStatus: () => true }
      );

      if (response?.data?.user?.id) {
        toast.success("Cadastro criado com sucesso");
        router.push("/auth/login");
      } else if (response.status === 40) {
        toast.error("E-mail já cadastrado! Faça login para continuar");
      } else {
        toast.error(
          "Erro inesperado ao cadastrar. Tente novamente mais tarde."
        );
      }
    } catch (err) {
      toast.error("Falha ao cadastrar! Tente novamente");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <h1 className="mb-3 text-4xl font-bold">Bem vindo</h1>
        <p className="mb-8 text-muted-foreground">
          Conversas automatizadas que parecem humanas, com variações de tempo e
          estilo de escrita.
        </p>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                aria-invalid={!!errors?.name}
                type="text"
                id="name"
                placeholder="João da silva"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                {...register("email")}
                aria-invalid={!!errors?.name}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                {...register("password")}
                aria-invalid={!!errors?.password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              )}
              <div className="text-sm">
                Já possui cadastro?{" "}
                <Button
                  className="text-blue-600 rounded-full font-bold"
                  variant="link"
                >
                  <Link href="/login">Fazer login</Link>
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              className="bg-green-600 hover:bg-green-700"
            >
              Cadastrar <LogIn className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-[#FCF5EA] relative h-full w-full flex flex-col justify-center items-center text-center p-4">
        <div>
          <Image
            src="/logo.png"
            height={400}
            width={400}
            alt="Faça login"
            className="object-cover"
          />
        </div>
        <div className="mt-4 max-w-lg">
          <p className="text-xl text-gray-600">
            WarmZap conecta contas recém-criadas e simula conversas de forma
            automática, reduzindo as chances de bloqueio e mantendo seus chips
            ativos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
