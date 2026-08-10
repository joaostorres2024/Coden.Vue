<template>
  <div class="column items-center col-12">
    <div class="background">
      <img class="img-logo" src="../assets/Logo Coden Branca.png" alt="" />
    </div>

    <div>
      <q-card
        class="column justify-center q-pa-lg card"
        style="width: 400px; height: 330px"
      >
        <div class="text-h6 text-bold login-titulo">
          Bem-vindo ao sistema Coden!
        </div>
        <div class="login-subtitulo">Faça login para continuar.</div>

        <form id="login-form" @submit.prevent="realizarLogin">
          <q-input
            v-model="usuario"
            class="full-width q-my-md login-input-email"
            label="Usuário"
            outlined
            dense
            input-id="login-input-email"
          />

          <q-input
            :type="verSenha ? 'text' : 'password'"
            class="full-width login-input-senha"
            label="Senha"
            v-model="senha"
            outlined
            dense
            input-id="login-input-senha"
          >
            <template v-slot:append>
              <q-icon
                :name="verSenha ? 'visibility_off' : 'visibility'"
                class="cursor-pointer login-toggle-senha"
                id="login-toggle-senha"
                @click="verSenha = !verSenha"
              />
            </template>
          </q-input>

          <q-btn
            unelevated
            class="full-width q-mt-md bg-primary text-white text-bold login-btn-entrar"
            label="Entrar"
            type="submit"
            :loading="loading"
            id="login-btn-entrar"
          />

          <q-btn
            unelevated
            class="full-width q-mt-md bg-transparent text-black login-btn-esqueci-senha"
            label="Esqueci minha senha"
            id="login-btn-esqueci-senha"
            @click="abrirRecuperacao"
          />
        </form>
      </q-card>
    </div>
    <div class="q-mt-lg direitos">@2026 CODEN</div>

    <!-- Diálogo de recuperação de senha -->
    <q-dialog v-model="recuperarDialog" persistent>
      <q-card style="width: 400px" class="q-pa-lg">

        <!-- Etapa 1: solicitar código -->
        <template v-if="etapaRecuperacao === 1">
          <div class="text-h6 q-mb-sm">Recuperar senha</div>
          <div class="text-caption text-grey-7 q-mb-md">
            Informe seu usuário. Enviaremos um código para o e-mail cadastrado da empresa.
          </div>

          <q-input
            v-model="usuarioRecuperacao"
            label="Usuário"
            outlined
            dense
            class="q-mb-md"
            input-id="recuperar-input-usuario"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancelar" @click="fecharRecuperacao" />
            <q-btn
              unelevated
              color="primary"
              label="Enviar código"
              :loading="enviandoCodigo"
              @click="enviarCodigo"
            />
          </div>
        </template>

        <!-- Etapa 2: validar código e definir nova senha -->
        <template v-else-if="etapaRecuperacao === 2">
          <div class="text-h6 q-mb-sm text-center">Digite o código</div>
          <div class="text-body2 text-grey-7 q-mb-lg text-center">
            Enviamos um código de verificação de 6 dígitos para o e-mail cadastrado no seu estabelecimento. <br><br> Confira sua caixa de entrada e digite o código abaixo para continuar.
          </div>

          <!-- Caixas de código -->
          <div class="row no-wrap items-center justify-center q-gutter-xs codigo-boxes q-mb-sm">
            <template v-for="(digit, index) in codigoDigits">
              <div v-if="index === 3" :key="'dash-' + index" class="codigo-dash">-</div>
              <input
                :key="index"
                :ref="'codigoInput' + index"
                v-model="codigoDigits[index]"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="1"
                class="codigo-box"
                :class="{ 'codigo-box-erro': codigoInvalido }"
                :disabled="validandoCodigo"
                @input="onDigitoInput(index, $event)"
                @keydown="onDigitoKeydown(index, $event)"
                @paste="onDigitoPaste($event)"
                @focus="onDigitoFocus(index)"
              />
            </template>
          </div>

          <div v-if="validandoCodigo" class="text-center text-caption text-grey-7 q-mb-md">
            Validando código...
          </div>
          <div v-else-if="codigoInvalido" class="text-center text-caption text-negative q-mb-md">
            Código inválido ou expirado
          </div>
          <div v-else class="q-mb-md" style="height: 20px" />

          <template v-if="codigoValidado">
            <q-input
              :type="verNovaSenha ? 'text' : 'password'"
              v-model="novaSenha"
              label="Nova senha"
              outlined
              dense
              class="q-mb-md"
              input-id="recuperar-input-nova-senha"
            >
              <template v-slot:append>
                <q-icon
                  :name="verNovaSenha ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="verNovaSenha = !verNovaSenha"
                />
              </template>
            </q-input>

            <q-input
              :type="verNovaSenha ? 'text' : 'password'"
              v-model="confirmarSenha"
              label="Confirmar nova senha"
              outlined
              dense
              class="q-mb-md"
              input-id="recuperar-input-confirmar-senha"
            />
          </template>

          <div class="row justify-between q-gutter-sm">
            <q-btn unelevated class="text-white bg-red" label="Cancelar" @click="fecharRecuperacao" />
            <q-btn
              v-if="codigoValidado"
              unelevated
              color="primary"
              label="Redefinir senha"
              :disable="!podeRedefinir"
              :loading="redefinindo"
              @click="redefinirSenha"
            />
          </div>
        </template>

      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { authService } from "../services/authService";

@Component
export default class LoginComponent extends Vue {
  usuario = "";
  senha = "";
  erro = "";
  loading = false;
  verSenha = false;

  // --- Recuperação de senha ---
  recuperarDialog = false;
  etapaRecuperacao = 1;

  usuarioRecuperacao = "";
  enviandoCodigo = false;

  codigoDigits: string[] = ["", "", "", "", "", ""];
  codigoValidado = false;
  codigoInvalido = false;
  validandoCodigo = false;

  novaSenha = "";
  confirmarSenha = "";
  verNovaSenha = false;
  redefinindo = false;

  get codigoCompleto(): string {
    return this.codigoDigits.join("");
  }

  get podeRedefinir(): boolean {
    return (
      this.codigoValidado &&
      this.novaSenha.length >= 6 &&
      this.novaSenha === this.confirmarSenha
    );
  }

  abrirRecuperacao() {
    this.usuarioRecuperacao = this.usuario;
    this.etapaRecuperacao = 1;
    this.recuperarDialog = true;
  }

  fecharRecuperacao() {
    this.recuperarDialog = false;
    this.etapaRecuperacao = 1;
    this.usuarioRecuperacao = "";
    this.codigoDigits = ["", "", "", "", "", ""];
    this.codigoValidado = false;
    this.codigoInvalido = false;
    this.novaSenha = "";
    this.confirmarSenha = "";
  }

  focarCaixa(index: number) {
    this.$nextTick(() => {
      const refs = this.$refs["codigoInput" + index] as HTMLInputElement[] | undefined;
      const el = refs && refs[0];
      if (el) el.focus();
    });
  }

  onDigitoFocus(index: number) {
    // seleciona o conteúdo ao focar, facilitando substituir o dígito
    const refs = this.$refs["codigoInput" + index] as HTMLInputElement[] | undefined;
    const el = refs && refs[0];
    if (el) el.select();
  }

  onDigitoInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, "");

    // mantém só o último dígito digitado, caso algo estranho passe
    valor = valor.slice(-1);

    this.codigoDigits.splice(index, 1, valor);
    this.codigoInvalido = false;

    if (valor && index < this.codigoDigits.length - 1) {
      this.focarCaixa(index + 1);
    }

    // se preencheu o último dígito, valida automaticamente
    if (valor && index === this.codigoDigits.length - 1) {
      this.validarCodigoAutomatico();
    }
  }

  onDigitoKeydown(index: number, event: KeyboardEvent) {
    if (event.key === "Backspace" && !this.codigoDigits[index] && index > 0) {
      this.focarCaixa(index - 1);
    }
  }

  onDigitoPaste(event: ClipboardEvent) {
    event.preventDefault();
    const texto = event.clipboardData?.getData("text") || "";
    const digitos = texto.replace(/\D/g, "").slice(0, 6).split("");

    if (!digitos.length) return;

    this.codigoDigits = ["", "", "", "", "", ""];
    digitos.forEach((d, i) => this.codigoDigits.splice(i, 1, d));
    this.codigoInvalido = false;

    const proximoIndex = Math.min(digitos.length, 5);
    this.focarCaixa(proximoIndex);

    if (digitos.length === 6) {
      this.validarCodigoAutomatico();
    }
  }

  async validarCodigoAutomatico() {
    if (this.codigoCompleto.length !== 6) return;

    this.validandoCodigo = true;
    this.codigoInvalido = false;
    try {
      const valido = await authService.validarCodigoRecuperacao(
        this.usuarioRecuperacao,
        this.codigoCompleto
      );
      this.codigoValidado = valido;
      this.codigoInvalido = !valido;
    } catch (err: any) {
      this.codigoValidado = false;
      this.codigoInvalido = true;
    } finally {
      this.validandoCodigo = false;
    }
  }

  async enviarCodigo() {
    if (!this.usuarioRecuperacao) {
      this.$q.notify({ color: "negative", message: "Informe o usuário", icon: "error" });
      return;
    }

    this.enviandoCodigo = true;
    try {
      const msg = await authService.solicitarCodigoRecuperacao(this.usuarioRecuperacao);
      this.$q.notify({ color: "positive", message: msg, icon: "check" });
      this.etapaRecuperacao = 2;
      this.focarCaixa(0);
    } catch (err: any) {
      this.$q.notify({
        color: "negative",
        message: err.response?.data || "Erro ao enviar código",
        icon: "error",
      });
    } finally {
      this.enviandoCodigo = false;
    }
  }

  async redefinirSenha() {
    if (!this.podeRedefinir) return;

    this.redefinindo = true;
    try {
      const msg = await authService.redefinirSenha({
        usuario: this.usuarioRecuperacao,
        codigo: this.codigoCompleto,
        novaSenha: this.novaSenha,
      });
      this.$q.notify({ color: "positive", message: msg, icon: "check" });
      this.fecharRecuperacao();
    } catch (err: any) {
      this.$q.notify({
        color: "negative",
        message: err.response?.data || "Erro ao redefinir senha",
        icon: "error",
      });
    } finally {
      this.redefinindo = false;
    }
  }

  async realizarLogin() {
    this.erro = "";
    this.loading = true;

    try {
      await authService.login({ usuario: this.usuario, senha: this.senha });
      this.$router.push("/");
      this.$q.notify({
        color: "positive",
        message: "Bem-vindo " + this.usuario,
        icon: "check",
      });
    } catch (err: any) {
      this.$q.notify({
        color: "negative",
        message: err.response?.data || "Erro ao realizar login",
        icon: "error",
      });
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45vh;
  background: linear-gradient(to right, #3998f7 0%, #1976d2 100%);
}

.img-logo {
  width: 220px;
}

.card {
  border-radius: 10px;
  position: relative;
  bottom: 120px;
  z-index: 1000;
}

.direitos {
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 11px;
}

/* Caixas de código */
.codigo-boxes {
  width: 100%;
}

.codigo-box {
  width: 42px;
  height: 52px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background: #eef1f4;
  color: #1a1a1a;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
}

.codigo-box:focus {
  background: #e3ecfb;
  box-shadow: 0 0 0 2px #1976d2;
}

.codigo-box-erro {
  box-shadow: 0 0 0 2px #c10015;
  background: #fbe4e4;
}

.codigo-box:disabled {
  opacity: 0.6;
}

.codigo-dash {
  font-size: 22px;
  font-weight: 700;
  color: #9aa4b1;
  padding: 0 2px;
}
</style>
