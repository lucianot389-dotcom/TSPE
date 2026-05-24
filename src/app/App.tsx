import { useState } from "react";
import { User, MapPin, Stethoscope, Building2, Users, FlaskConical, AlertTriangle, CheckCircle, Zap, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import pernambuco from "@/imports/imagem_2026-05-22_200352072-1.png";

// ── URL da API Python — troque se o servidor estiver em outro endereço ──
const API_URL = "http://localhost:5000";

const dadosCsv = [
  {
    doenca_cid: "Algumas doenças infecciosas e parasitárias",
    causas: ["Dengue (vírus DENV)", "Tuberculose (Mycobacterium tuberculosis)", "Leptospirose (Leptospira spp.)", "HIV/AIDS (vírus HIV)"],
    tratamentos: ["Hidratação oral e venosa", "Rifampicina + Isoniazida + Pirazinamida + Etambutol", "Penicilina G cristalina / Amoxicilina", "Terapia antirretroviral (TARV)"],
  },
  {
    doenca_cid: "Doenças do aparelho circulatório",
    causas: ["Hipertensão arterial sistêmica", "Infarto agudo do miocárdio", "Insuficiência cardíaca congestiva", "Acidente vascular cerebral"],
    tratamentos: ["Anti-hipertensivos: losartana, enalapril, anlodipino", "Anticoagulantes: AAS, clopidogrel, heparina", "Diuréticos: furosemida, espironolactona", "Estatinas: atorvastatina, rosuvastatina"],
  },
  {
    doenca_cid: "Doenças do aparelho respiratório",
    causas: ["Pneumonia bacteriana e viral", "DPOC — Doença Pulmonar Obstrutiva Crônica", "Asma brônquica", "Insuficiência respiratória aguda"],
    tratamentos: ["Antibióticos: amoxicilina, azitromicina, ceftriaxona", "Broncodilatadores: salbutamol, fenoterol, ipratrópio", "Corticoides: prednisona, budesonida, dexametasona", "Oxigenioterapia e ventilação mecânica"],
  },
  {
    doenca_cid: "Sint., sinais e achad. anorm. ex. clín. e laborat.",
    causas: ["Febre de origem indeterminada", "Dor abdominal inespecífica", "Alterações laboratoriais sem diagnóstico definido", "Síncope e colapso"],
    tratamentos: ["Investigação laboratorial: hemograma, PCR, culturas", "Analgésicos e antipiréticos: dipirona, paracetamol", "Hidratação venosa de suporte", "Monitorização e internação para observação clínica"],
  },
  {
    doenca_cid: "Neoplasias (tumores)",
    causas: ["Câncer de mama", "Câncer de próstata", "Câncer de colo do útero (HPV)", "Leucemias e linfomas"],
    tratamentos: ["Quimioterapia: ciclofosfamida, doxorrubicina, cisplatina", "Radioterapia em tumores sólidos localizados", "Imunoterapia e terapia-alvo: trastuzumabe, pembrolizumabe", "Cirurgia oncológica — ressecção tumoral"],
  },
  {
    doenca_cid: "Doenças do sistema nervoso",
    causas: ["Epilepsia", "Meningite bacteriana e viral", "Doença de Parkinson", "Neuropatias periféricas por diabetes ou álcool"],
    tratamentos: ["Anticonvulsivantes: carbamazepina, valproato, fenitoína", "Antibióticos IV: ceftriaxona, ampicilina (meningite)", "Antiparkinsonianos: levodopa, carbidopa, pramipexol", "Corticoides e imunoglobulina para neuropatias autoimunes"],
  },
  {
    doenca_cid: "Doenças do aparelho geniturinário",
    causas: ["Infecção do trato urinário", "Insuficiência renal aguda e crônica", "Litíase renal (cálculo)", "Doença inflamatória pélvica"],
    tratamentos: ["Antibióticos: nitrofurantoína, ciprofloxacino, fosfomicina", "Diálise para insuficiência renal grave", "Analgésicos e antiespasmódicos: escopolamina, dipirona", "Hidratação intensiva e litotripsia extracorpórea"],
  },
  {
    doenca_cid: "Doenças endócrinas, nutricionais e metabólicas",
    causas: ["Diabetes mellitus tipo 2", "Hipotireoidismo e Hipertireoidismo", "Desnutrição proteico-calórica", "Obesidade com comorbidades"],
    tratamentos: ["Hipoglicemiantes: metformina, insulina, glibenclamida", "Levotiroxina (hipo) e metimazol (hipertireoidismo)", "Suporte nutricional e nutrição enteral", "Vitaminas e minerais: vitamina D, ferro, zinco"],
  },
  {
    doenca_cid: "Doenças do aparelho digestivo",
    causas: ["Gastroenterite aguda por rotavírus e salmonela", "Doença ulcerosa péptica por H. pylori", "Hepatite viral A, B e C", "Pancreatite aguda"],
    tratamentos: ["Hidratação oral/venosa e sais de reidratação", "Inibidores de bomba de prótons: omeprazol, pantoprazol", "Antibióticos: amoxicilina + claritromicina (H. pylori)", "Antieméticos: ondansetrona, metoclopramida"],
  },
  {
    doenca_cid: "Doenças do sangue, órgãos hemat. e transt. imunitar.",
    causas: ["Anemia ferropriva", "Anemia falciforme", "Trombocitopenia imune (PTI)", "Linfadenopatia reativa"],
    tratamentos: ["Sulfato ferroso oral e ferro sacarose IV", "Hidroxiureia para anemia falciforme", "Corticoides: prednisona, dexametasona (PTI)", "Transfusão de hemácias e plaquetas para casos graves"],
  },
  {
    doenca_cid: "Malf. cong., deformid. e anomalias cromossômicas",
    causas: ["Síndrome de Down (trissomia 21)", "Cardiopatias congênitas (CIV, CIA, PCA)", "Fissura labiopalatina", "Espinha bífida"],
    tratamentos: ["Cirurgia corretiva de cardiopatias / valvoplastia", "Cirurgia plástica e reparadora para fissura labiopalatina", "Reabilitação fisioterápica e fonoaudiológica", "Suporte multidisciplinar: genética, neurologia, pediatria"],
  },
  {
    doenca_cid: "Lesões, envenenamentos e conseq. de causas externas",
    causas: ["Politrauma por acidentes de trânsito", "Queimaduras", "Intoxicação exógena por medicamentos e agrotóxicos", "Afogamento e asfixia"],
    tratamentos: ["Suporte avançado de vida em UTI e ventilação mecânica", "Curativos, enxertos e cirurgia plástica para queimaduras", "Carvão ativado e lavagem gástrica para intoxicações", "Analgesia: morfina, tramadol, cetamina"],
  },
  {
    doenca_cid: "Algumas afecções originadas no período perinatal",
    causas: ["Prematuridade extrema (< 28 semanas)", "Asfixia perinatal", "Sepse neonatal precoce", "Icterícia neonatal"],
    tratamentos: ["Surfactante pulmonar exógeno para prematuridade", "Hipotermia terapêutica para asfixia perinatal", "Antibióticos IV: ampicilina e gentamicina (sepse neonatal)", "Fototerapia e exsanguineotransfusão para icterícia grave"],
  },
  {
    doenca_cid: "Doenças da pele e do tecido subcutâneo",
    causas: ["Celulite bacteriana (Streptococcus e Staphylococcus)", "Pênfigo vulgar", "Erisipela", "Dermatite atópica grave"],
    tratamentos: ["Antibióticos: cefalexina, amoxicilina-clavulanato, oxacilina IV", "Corticoides sistêmicos: prednisona (pênfigo e dermatite)", "Imunossupressores: azatioprina, metotrexato (pênfigo)", "Curativos e antissépticos tópicos: clorexidina, iodopovidona"],
  },
  {
    doenca_cid: "Transtornos mentais e comportamentais",
    causas: ["Esquizofrenia e psicoses", "Transtorno bipolar (maníaco e depressivo)", "Dependência química — álcool e crack", "Tentativa de suicídio"],
    tratamentos: ["Antipsicóticos: haloperidol, risperidona, clozapina", "Estabilizadores de humor: lítio, valproato, lamotrigina", "Antidepressivos: sertralina, fluoxetina, venlafaxina", "Acolhimento em CAPS / CAPS-AD e internação psiquiátrica"],
  },
  {
    doenca_cid: "Doenças do sist. osteomuscular e tec. conjuntivo",
    causas: ["Artrite reumatoide", "Osteoporose com fratura", "Lúpus eritematoso sistêmico (LES)", "Osteomielite"],
    tratamentos: ["DMARDs: metotrexato, hidroxicloroquina, leflunomida", "Biológicos: adalimumabe, etanercepte (artrite refratária)", "Corticoides: prednisona, metilprednisolona (LES)", "Antibióticos IV: oxacilina, ceftriaxona (osteomielite)"],
  },
  {
    doenca_cid: "Contatos com serviços de saúde",
    causas: ["Internação para procedimento eletivo", "Quimioterapia ou radioterapia ambulatorial", "Acompanhamento pós-cirúrgico", "Reabilitação e fisioterapia"],
    tratamentos: ["Preparo pré-operatório e cuidados pós-operatórios", "Sessões de quimioterapia e suporte antiemético", "Fisioterapia motora e respiratória", "Consultas e exames de controle periódico"],
  },
  {
    doenca_cid: "Gravidez, parto e puerpério",
    causas: ["Pré-eclâmpsia e eclâmpsia", "Diabetes gestacional", "Infecção puerperal — endometrite", "Hemorragia pós-parto"],
    tratamentos: ["Anti-hipertensivos: metildopa, nifedipino (pré-eclâmpsia)", "Sulfato de magnésio para prevenção de convulsões", "Ocitocina e uterotônicos para hemorragia pós-parto", "Antibióticos: amoxicilina, clindamicina (infecção puerperal)"],
  },
  {
    doenca_cid: "Doenças do olho e anexos",
    causas: ["Conjuntivite infecciosa bacteriana e viral", "Glaucoma agudo", "Catarata com indicação cirúrgica", "Endoftalmite"],
    tratamentos: ["Colírios antibióticos: tobramicina, ciprofloxacino (conjuntivite)", "Colírios hipotensores: timolol, dorzolamida (glaucoma)", "Facoemulsificação com implante de LIO (catarata)", "Antibióticos intravítreos: vancomicina, ceftazidima (endoftalmite)"],
  },
];

// Mapeamento: doença do site → nome exato no dataset do ML
const MAPA_DOENCAS: Record<string, string> = {
  "Algumas doenças infecciosas e parasitárias":          "Algumas doenças infecciosas e parasitárias",
  "Doenças do aparelho circulatório":                    "Doenças do aparelho circulatório",
  "Doenças do aparelho respiratório":                    "Doenças do aparelho respiratório",
  "Sint., sinais e achad. anorm. ex. clín. e laborat.":  "Sint sinais e achad anorm ex clín e laborat",
  "Neoplasias (tumores)":                                "Neoplasias (tumores)",
  "Doenças do sistema nervoso":                          "Doenças do sistema nervoso",
  "Doenças do aparelho geniturinário":                   "Doenças do aparelho geniturinário",
  "Doenças endócrinas, nutricionais e metabólicas":      "Doenças endócrinas nutricionais e metabólicas",
  "Doenças do aparelho digestivo":                       "Doenças do aparelho digestivo",
  "Doenças do sangue, órgãos hemat. e transt. imunitar.":"Doenças sangue órgãos hemat e transt imunitár",
  "Malf. cong., deformid. e anomalias cromossômicas":    "Malf cong deformid e anomalias cromossômicas",
  "Lesões, envenenamentos e conseq. de causas externas": "Lesões enven e alg out conseq causas externas",
  "Algumas afecções originadas no período perinatal":    "Algumas afec originadas no período perinatal",
  "Doenças da pele e do tecido subcutâneo":              "Doenças da pele e do tecido subcutâneo",
  "Transtornos mentais e comportamentais":               "Transtornos mentais e comportamentais",
  "Doenças do sist. osteomuscular e tec. conjuntivo":    "Doenças sist osteomuscular e tec conjuntivo",
  "Contatos com serviços de saúde":                      "Contatos com serviços de saúde",
  "Gravidez, parto e puerpério":                         "Gravidez parto e puerpério",
  "Doenças do olho e anexos":                            "Doenças do olho e anexos",
};

// Internações e permanências médias por doença (baseadas no dataset)
const DADOS_MEDIOS: Record<string, { internacoes: number; permanencia: number }> = {
  "Doenças do aparelho circulatório":   { internacoes: 8000, permanencia: 7.5 },
  "Doenças do aparelho respiratório":   { internacoes: 7000, permanencia: 5.2 },
  "Neoplasias (tumores)":               { internacoes: 4000, permanencia: 7.8 },
  "Gravidez, parto e puerpério":        { internacoes: 15000, permanencia: 2.3 },
  "Algumas afecções originadas no período perinatal": { internacoes: 5000, permanencia: 5.5 },
  "Transtornos mentais e comportamentais": { internacoes: 1500, permanencia: 15.0 },
  "Lesões, envenenamentos e conseq. de causas externas": { internacoes: 3500, permanencia: 5.8 },
  "Doenças endócrinas, nutricionais e metabólicas": { internacoes: 3000, permanencia: 6.0 },
};
const DEFAULT_DADOS = { internacoes: 3000, permanencia: 4.5 };

type Resultado = {
  tx_mortalidade: number;
  permanencia: number;
  risco: "Baixo" | "Médio" | "Alto";
  probabilidades: { Baixo: number; Médio: number; Alto: number };
};

const faixasIdade = [
  "Menor 1 ano","1 a 4 anos","5 a 9 anos","10 a 14 anos","15 a 19 anos",
  "20 a 29 anos","30 a 39 anos","40 a 49 anos","50 a 59 anos",
  "60 a 69 anos","70 a 79 anos","80 anos e mais",
];

const regioesPE = [
  "Metropolitana","Agreste","Sertão","Vale do São Francisco e Araripe",
];

const hospitaisPE = [
  "Hospital das Clínicas da UFPE — Recife",
  "Hospital Universitário Oswaldo Cruz — Recife",
  "Hospital Eduardo Campos da Pessoa Idosa — Recife",
  "Hospital da Restauração — Recife",
  "Hospital Getúlio Vargas — Recife",
  "Hospital Agamenon Magalhães — Recife",
  "IMIP — Recife",
  "Hospital João Murilo de Oliveira — Vitória de Santo Antão",
  "Hospital Regional do Agreste — Caruaru",
  "Hospital Regional Ruy de Barros Correia — Arcoverde",
  "Hospital Regional de Afogados da Ingazeira",
  "Hospital Dom Malan — Petrolina",
  "Hospital Regional Fernando Bezerra — Ouricuri",
];

const selectClass = "w-full px-4 py-3 bg-input-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer";

export default function App() {
  const [formData, setFormData] = useState({
    idade: "", sexo: "", regiao: "", hospital: "",
    sintomas: "", doenca: "", remedio: "",
  });

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const sintomaAtual = dadosCsv.find((d) => d.doenca_cid === formData.sintomas);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "sintomas") {
      setFormData((prev) => ({ ...prev, sintomas: value, doenca: "", remedio: "" }));
      setResultado(null);
      setErroApi(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultado(null);
    setErroApi(null);
    setCarregando(true);

    // Mapear doença do site para o nome do dataset ML
    const doencaML = MAPA_DOENCAS[formData.sintomas] ?? formData.sintomas;
    const dadosMedios = DADOS_MEDIOS[doencaML] ?? DEFAULT_DADOS;

    try {
      const resposta = await fetch(`${API_URL}/prever`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doenca:            doencaML,
          faixa_etaria:      formData.idade,
          internacoes:       dadosMedios.internacoes,
          media_permanencia: dadosMedios.permanencia,
        }),
      });

      if (!resposta.ok) {
        const err = await resposta.json();
        throw new Error(err.erro ?? "Erro desconhecido na API.");
      }

      const dados: Resultado = await resposta.json();
      setResultado(dados);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Não foi possível conectar à API.";
      setErroApi(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setFormData({ idade: "", sexo: "", regiao: "", hospital: "", sintomas: "", doenca: "", remedio: "" });
    setResultado(null);
    setErroApi(null);
  };

  const riscoConfig = {
    Alto:  { bg: "bg-red-50",    border: "border-red-300",    text: "text-red-800",    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,   label: "⚠️ Risco Alto"  },
    Médio: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800", icon: <Zap className="w-5 h-5 text-yellow-600" />,           label: "⚡ Risco Médio" },
    Baixo: { bg: "bg-green-50",  border: "border-green-300",  text: "text-green-800",  icon: <CheckCircle className="w-5 h-5 text-green-600" />,    label: "✓ Risco Baixo" },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-t-2xl p-8 text-white shadow-lg relative">
          <div className="flex items-center gap-5 mb-2">
            <ImageWithFallback
              src={pernambuco}
              alt="Mapa com a bandeira do Estado de Pernambuco"
              className="h-20 w-auto object-contain flex-shrink-0"
            />
            <div>
              <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-1">Estado de Pernambuco</p>
              <p className="text-white text-2xl font-bold">Sistema de Saúde</p>
            </div>
          </div>
          <span className="absolute top-6 right-8 text-yellow-300 text-2xl font-extrabold tracking-widest">TSPE</span>
          <p className="text-blue-100 text-lg">Preencha os dados do paciente</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-b-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Idade */}
            <div className="space-y-2">
              <label htmlFor="idade" className="flex items-center gap-2 text-foreground font-semibold">
                <User className="w-5 h-5 text-primary" /> Idade
              </label>
              <select id="idade" name="idade" value={formData.idade} onChange={handleChange} className={selectClass} required>
                <option value="">Selecione a faixa etária</option>
                {faixasIdade.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Sexo */}
            <div className="space-y-2">
              <label htmlFor="sexo" className="flex items-center gap-2 text-foreground font-semibold">
                <Users className="w-5 h-5 text-primary" /> Sexo
              </label>
              <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} className={selectClass} required>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            {/* Região */}
            <div className="space-y-2">
              <label htmlFor="regiao" className="flex items-center gap-2 text-foreground font-semibold">
                <MapPin className="w-5 h-5 text-primary" /> Região
              </label>
              <select id="regiao" name="regiao" value={formData.regiao} onChange={handleChange} className={selectClass} required>
                <option value="">Selecione a região</option>
                {regioesPE.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Hospital */}
            <div className="space-y-2">
              <label htmlFor="hospital" className="flex items-center gap-2 text-foreground font-semibold">
                <Building2 className="w-5 h-5 text-primary" /> Hospital
              </label>
              <select id="hospital" name="hospital" value={formData.hospital} onChange={handleChange} className={selectClass} required>
                <option value="">Selecione o hospital</option>
                {hospitaisPE.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Doença / CID */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="sintomas" className="flex items-center gap-2 text-foreground font-semibold">
                <Stethoscope className="w-5 h-5 text-primary" /> Doença / CID
              </label>
              <select id="sintomas" name="sintomas" value={formData.sintomas} onChange={handleChange} className={selectClass} required>
                <option value="">Selecione a doença/CID</option>
                {dadosCsv.map((d) => <option key={d.doenca_cid} value={d.doenca_cid}>{d.doenca_cid}</option>)}
              </select>
            </div>

            {/* Causas Prováveis */}
            {sintomaAtual && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="doenca" className="flex items-center gap-2 text-foreground font-semibold">
                  <FlaskConical className="w-5 h-5 text-primary" /> Causas Prováveis
                </label>
                <select id="doenca" name="doenca" value={formData.doenca} onChange={handleChange} className={selectClass} required>
                  <option value="">Selecione a causa provável</option>
                  {sintomaAtual.causas.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {/* Tratamento */}
            {sintomaAtual && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="remedio" className="flex items-center gap-2 text-foreground font-semibold">
                  <FlaskConical className="w-5 h-5 text-primary" /> Tratamento Utilizado
                </label>
                <select id="remedio" name="remedio" value={formData.remedio} onChange={handleChange} className={selectClass} required>
                  <option value="">Selecione o tratamento</option>
                  {sintomaAtual.tratamentos.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 bg-primary hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {carregando
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisando...</>
                : "Enviar Dados"}
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="flex-1 bg-secondary hover:bg-accent text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-all border-2 border-border"
            >
              Limpar Formulário
            </button>
          </div>

          <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground text-center">
              ℹ️ Todos os campos são obrigatórios. Os dados serão processados de forma segura e confidencial.
            </p>
          </div>

          {/* ── ERRO DA API ── */}
          {erroApi && (
            <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Não foi possível obter a previsão</p>
                <p className="text-red-700 text-sm mt-1">{erroApi}</p>
                <p className="text-red-600 text-xs mt-1">Verifique se o servidor Python está rodando com <code className="bg-red-100 px-1 rounded">python api.py</code></p>
              </div>
            </div>
          )}

          {/* ── RESULTADO DO MODELO ── */}
          {resultado && (() => {
            const cfg = riscoConfig[resultado.risco];
            return (
              <div className={`mt-6 rounded-xl border-2 ${cfg.border} ${cfg.bg} overflow-hidden`}>
                <div className="bg-primary px-6 py-3 flex items-center gap-2">
                  {cfg.icon}
                  <span className="text-white font-semibold text-sm">Resultado da Previsão — Modelo de Machine Learning</span>
                </div>
                <div className="p-6">

                  {/* Cards de métricas */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <p className="text-2xl font-bold text-primary">{resultado.tx_mortalidade}%</p>
                      <p className="text-xs text-gray-500 mt-1">Taxa de mortalidade prevista</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <p className="text-2xl font-bold text-primary">{resultado.permanencia} dias</p>
                      <p className="text-xs text-gray-500 mt-1">Permanência hospitalar prevista</p>
                    </div>
                  </div>

                  {/* Nível de risco */}
                  <div className={`rounded-lg p-4 border ${cfg.border} ${cfg.bg}`}>
                    <div className="flex items-center gap-2 mb-3">
                      {cfg.icon}
                      <span className={`font-bold text-base ${cfg.text}`}>{cfg.label}</span>
                    </div>

                    {/* Barra de probabilidades */}
                    <p className="text-xs text-gray-500 mb-2 font-medium">Probabilidades calculadas pelo modelo:</p>
                    {(["Baixo", "Médio", "Alto"] as const).map((nivel) => {
                      const pct = Math.round(resultado.probabilidades[nivel] * 100);
                      const barColor = nivel === "Alto" ? "bg-red-400" : nivel === "Médio" ? "bg-yellow-400" : "bg-green-400";
                      return (
                        <div key={nivel} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-gray-600 w-10">{nivel}</span>
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Previsão baseada em dados históricos do SIH/SUS — Pernambuco. Não substitui avaliação clínica.
                  </p>
                </div>
              </div>
            );
          })()}

        </form>
      </div>
    </div>
  );
}
