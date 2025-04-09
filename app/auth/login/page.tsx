"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/userContext";
import { AuthService } from "@/services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface LoginProps {
  email?: string;
  password?: string;
}

const Login = () => {
  const router = useRouter();
  const { putUserData } = useUser();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O e-mail é obrigatório"),
    password: Yup.string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (customerData: LoginProps) => {
    if (!customerData.email || !customerData.password) {
      toast.error("E-mail e senha são obrigatórios.");
      return;
    }

    try {
      const userData = await toast.promise(
        AuthService.login(customerData.email, customerData.password),
        {
          pending: "Verificando dados",
          success: "Seja bem-vindo(a)",
          error: "Verifique seu e-email e senha",
        }
      );

      putUserData(userData);
      router.push("/dashboard");
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                {...register("email")}
                aria-invalid={!!errors?.email}
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
                Ainda não possui cadastro?{" "}
                <Button
                  className="text-blue-600 rounded-full font-bold"
                  variant="link"
                >
                  <Link href="/auth/register">cadastre-se aqui</Link>
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              type="submit"
            >
              Entrar <LogIn className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-[#FCF5EA] relative h-full w-full flex flex-col justify-center items-center text-center p-4">
        <div>
          <Image
            src="/sembg.png"
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

export default Login;
