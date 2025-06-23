import React, {useState} from 'react';

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    pesel: '',
    description: '',
    file: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const {name, value, files} = e.target;
    setForm((p) => ({...p, [name]: files ? files[0] : value}));
  };

  const peselValid = (v) => {
    if (!/^\d{11}$/.test(v)) return false;
    const w = [1,3,7,9,1,3,7,9,1,3];
    const s = w.reduce((a,c,i)=>a+c*parseInt(v[i],10),0);
    return (10 - (s%10))%10 === parseInt(v[10],10);
  };

  const validate = () => {
    const e = {};
    if (!/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż ]{2,50}$/.test(form.name)) e.name='Imię 2-50 znaków, tylko litery i spacje';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Niepoprawny e-mail';
    if (!peselValid(form.pesel)) e.pesel='Niepoprawny PESEL';
    if (form.description.length < 20 || form.description.length > 500) e.description='Opis 20-500 znaków';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    await fetch('http://localhost:4000/zgloszenie', {method:'POST', body:fd});
    alert('Wysłano');
    setForm({name:'',email:'',pesel:'',description:'',file:null});
  };

  return (
    <main className="wrapper">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h1>Zgłoszenie</h1>

        <label>
          Imię
          <input name="name" value={form.name} onChange={handleChange} required aria-invalid={!!errors.name}/>
        </label>
        {errors.name && <p className="error" role="alert">{errors.name}</p>}

        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} required aria-invalid={!!errors.email}/>
        </label>
        {errors.email && <p className="error" role="alert">{errors.email}</p>}

        <label>
          PESEL
          <input name="pesel" value={form.pesel} onChange={handleChange} required pattern="\d{11}" aria-invalid={!!errors.pesel}/>
        </label>
        {errors.pesel && <p className="error" role="alert">{errors.pesel}</p>}

        <label>
          Opis
          <textarea name="description" value={form.description} onChange={handleChange} required aria-invalid={!!errors.description}/>
        </label>
        {errors.description && <p className="error" role="alert">{errors.description}</p>}

        <label>
          Załącznik
          <input name="file" type="file" onChange={handleChange}/>
        </label>

        <button type="submit">Wyślij</button>
      </form>
    </main>
  );
}

export default App;
