from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import warnings
import os
warnings.filterwarnings('ignore')

app = Flask(__name__)

@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
    return response

df = pd.read_csv('dataset_ml__2_.csv', sep=';')

le_doenca = LabelEncoder()
le_faixa  = LabelEncoder()

df['doenca_enc'] = le_doenca.fit_transform(df['doenca_cid'])
df['faixa_enc']  = le_faixa.fit_transform(df['faixa_etaria'])

q33 = df['tx_mortalidade'].quantile(0.33)
q66 = df['tx_mortalidade'].quantile(0.66)

def classificar_risco(tx):
    if tx <= q33:   return 0
    elif tx <= q66: return 1
    else:           return 2

df['risco'] = df['tx_mortalidade'].apply(classificar_risco)

FEATURES = ['doenca_enc', 'faixa_enc', 'internacoes',
            'media_permanencia', 'media_perm_macro', 'tx_mort_macro']

X        = df[FEATURES]
y_mort   = df['tx_mortalidade']
y_perm   = df['media_permanencia']
y_risco  = df['risco']

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, ym_train, ym_test = train_test_split(X_scaled, y_mort,  test_size=0.2, random_state=42)
_,       _,      yp_train, yp_test = train_test_split(X_scaled, y_perm,  test_size=0.2, random_state=42)
_,       _,      yr_train, yr_test = train_test_split(X_scaled, y_risco, test_size=0.2, random_state=42)

rf_mort  = RandomForestRegressor(n_estimators=100, random_state=42)
rf_perm  = RandomForestRegressor(n_estimators=100, random_state=42)
rf_risco = RandomForestClassifier(n_estimators=100, random_state=42)

rf_mort.fit(X_train, ym_train)
rf_perm.fit(X_train, yp_train)
rf_risco.fit(X_train, yr_train)

RISCO_NOMES = {0: 'Baixo', 1: 'Médio', 2: 'Alto'}

@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'ok', 'modelo': 'treinado', 'servico': 'API ML TSPE'})

@app.route('/saude', methods=['GET'])
def saude():
    return jsonify({'status': 'ok', 'modelo': 'treinado'})

@app.route('/opcoes', methods=['GET'])
def opcoes():
    return jsonify({
        'doencas': list(le_doenca.classes_),
        'faixas':  list(le_faixa.classes_),
    })

@app.route('/prever', methods=['POST', 'OPTIONS'])
def prever():
    if request.method == 'OPTIONS':
        return '', 204

    dados = request.get_json()

    for campo in ['doenca', 'faixa_etaria', 'internacoes', 'media_permanencia']:
        if campo not in dados:
            return jsonify({'erro': f'Campo obrigatório ausente: {campo}'}), 400

    doenca            = dados['doenca']
    faixa_etaria      = dados['faixa_etaria']
    internacoes       = float(dados['internacoes'])
    media_permanencia = float(dados['media_permanencia'])

    if doenca not in le_doenca.classes_:
        return jsonify({'erro': 'Doença não encontrada.', 'opcoes': list(le_doenca.classes_)}), 422

    if faixa_etaria not in le_faixa.classes_:
        return jsonify({'erro': 'Faixa etária não encontrada.', 'opcoes': list(le_faixa.classes_)}), 422

    d_enc = le_doenca.transform([doenca])[0]
    f_enc = le_faixa.transform([faixa_etaria])[0]

    grupo    = df[df['doenca_cid'] == doenca]
    mp_macro = grupo['media_perm_macro'].mean()
    tm_macro = grupo['tx_mort_macro'].mean()

    entrada        = np.array([[d_enc, f_enc, internacoes, media_permanencia, mp_macro, tm_macro]])
    entrada_scaled = scaler.transform(entrada)

    tx_mort = float(rf_mort.predict(entrada_scaled)[0])
    perm    = float(rf_perm.predict(entrada_scaled)[0])
    risco   = int(rf_risco.predict(entrada_scaled)[0])
    proba   = rf_risco.predict_proba(entrada_scaled)[0]

    return jsonify({
        'tx_mortalidade': round(tx_mort, 2),
        'permanencia':    round(perm, 1),
        'risco':          RISCO_NOMES[risco],
        'probabilidades': {
            'Baixo': round(float(proba[0]), 3),
            'Médio': round(float(proba[1]), 3),
            'Alto':  round(float(proba[2]), 3),
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
