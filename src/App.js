import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,useParams } from "react-router-dom";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion  } from "firebase/firestore";
import { db } from "./firebase";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/:groupId/payments/" element={<PaymentPage />} />
        <Route path="/:groupId/settlement" element={<SettlementPage />} />
      </Routes>
    </Router>
  );
}

function IndexPage() {
  const navigate = useNavigate();
  const goToGroup = () => {
    navigate("/group");
  };
  return (
    <div className="container">
      <h1>ウェイト勘定</h1>
      <p>職場や研究室、部活などで、役職別に支払いを調整できるウェイト勘定。これまでの単純な割り勘から、役職に応じた傾斜をつけた計算に進化しました。</p>
      <div className="button-container">
        <button onClick={goToGroup}>はじめる</button>
      </div>
    </div>
  );
}

function GroupPage() {
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [weights, setWeights] = useState({});
  const navigate = useNavigate();

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setWeights({ ...weights, [newMember.trim()]: 1 }); // 初期重みは1
      setNewMember("");
    }
  };

  const removeMember = (name) => {
    setMembers(members.filter((member) => member !== name));
    const newWeights = { ...weights };
    delete newWeights[name];
    setWeights(newWeights);
  };

  const updateWeight = (name, weight) => {
    setWeights({ ...weights, [name]: parseFloat(weight) });
  };

  const goToPayments = async () => {
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        title,
        members,
        weights,
      });
      navigate(`/${docRef.id}/payments`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="container">
      <h2>グループ作成</h2>
      <div className="form-group">
        <label>イベント名:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="北海道旅行" required />
      </div>
      <div className="form-group">
        <label>参加者:</label>
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="名前を入力"
        />
        <div className="button-container">
          <button onClick={addMember}>+ 追加</button>
        </div>
      </div>
      <ul>
      <h3>重み入力</h3>
        {members.map((member) => (
          <li key={member}>
            <span className="member-name">{member.length > 6 ? member.slice(0, 6) + '\n' + member.slice(6) : member}</span>

            
            <input
              type="number"
              value={weights[member]}
              onChange={(e) => updateWeight(member, e.target.value)}
              min="0"
              step="1"
            />

            <button onClick={() => removeMember(member)} style={{ whiteSpace: "nowrap" }}>x 削除</button>

          </li>
        ))}
      </ul>
      <div className="button-container">
        <button onClick={goToPayments} disabled={members.length === 0 || totalWeight <= 0}>
          &gt;&gt; 作成
        </button>
      </div>
    </div>
  );
}


function PaymentPage() {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState({ title: "", members: [], weights: {} });
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [involves, setInvolves] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGroupData(data);
        setInvolves(data.members); // membersを初期値として設定
        setHistory(data.history || []);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      payer,
      amount: parseInt(amount),
      involves,
      description,
    };
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      history: arrayUnion(newEntry),
    });
    setHistory([...history, newEntry]);
    setPayer("");
    setAmount(0);
    setDescription("");
    setInvolves(groupData.members); // 再度membersで初期化
  };

  const goToSettlement = async () => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        title: groupData.title,
        members: groupData.members,
        weights: groupData.weights,
        history: history,
      });
  
      // 保存したドキュメントのIDを使って遷移
      navigate(`/${groupId}/settlement`);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  
  

  return (
    <div className="container">
      <h1>{groupData.title}</h1>
      <h2>立替え登録</h2>
      <form onSubmit={handlePaymentSubmit} className="section">
        <div className="form-group">
          <label>支払った人:</label>
          <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
            <option value="">選択してください</option>
            {groupData.members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>項目名:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="昼食代" required />
        </div>
        <div className="form-group">
          <label>金額(円):</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="form-group checkbox-group">
          <label>立て替えてもらった人:</label>
          {groupData.members.map((member) => (
            <div key={member}>
              <input
                type="checkbox"
                checked={involves.includes(member)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setInvolves([...involves, member]);
                  } else {
                    setInvolves(involves.filter((name) => name !== member));
                  }
                }}
              />
              {member}
            </div>
          ))}
        </div>
        <div className="button-container">
          <button type="submit">+ 登録</button>
        </div>
      </form>

      <h3>支払い履歴</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.description} : {entry.payer} → {entry.involves.join("・")} {entry.amount} 円
          </li>
        ))}
      </ul>
      <div className="button-container">
         <button onClick={goToSettlement} disabled={history.length === 0}>
           &gt;&gt; 清算
         </button>
       </div>
    </div>
  );
}

function SettlementPage() {
  const { groupId } = useParams();
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState([]);
  const [members, setMembers] = useState([]);
  const [weights, setWeights] = useState({});
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const docRef = doc(db, "groups", groupId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setMembers(data.members || []);
          setWeights(data.weights || {});
          setHistory(data.history || []);
        } else {
          console.error("No such document!");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    };

    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    if (members.length && history.length) {
      calculateBalances();
    }
  }, [members, history, weights]);

  useEffect(() => {
    if (Object.keys(balances).length) {
      calculateTransactions();
    }
  }, [balances]);

  const goToPayments = () => {
    navigate(`/${groupId}/payments`);
  };

  // 債権状態を計算する関数
  const calculateBalances = () => {
    const balanceSheet = {};

    // 初期化
    members.forEach((member) => {
      balanceSheet[member] = 0;
    });

    // 支払い履歴をもとに債権状態を計算
    history.forEach(({ payer, amount, involves }) => {
      const totalWeight = involves.reduce((sum, person) => sum + (weights[person] || 1), 0);
      const perPersonAmount = Math.ceil(amount / totalWeight);

      balanceSheet[payer] += amount;

      involves.forEach((person) => {
        balanceSheet[person] -= perPersonAmount * (weights[person] || 1);
      });
    });

    setBalances(balanceSheet);
  };

  // 最小回数で清算するための送金表を計算する関数
  const calculateTransactions = () => {
    const balanceArray = Object.entries(balances).map(([name, balance]) => ({
      name,
      balance,
    }));

    const transactions = [];

    let creditors = balanceArray.filter((p) => p.balance > 0);
    let debtors = balanceArray.filter((p) => p.balance < 0);

    while (creditors.length && debtors.length) {
      const creditor = creditors[0];
      const debtor = debtors[0];

      const amount = Math.min(creditor.balance, -debtor.balance);

      transactions.push({
        sender: debtor.name,
        receiver: creditor.name,
        amount,
      });

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance === 0) creditors.shift();
      if (debtor.balance === 0) debtors.shift();
    }

    setTransactions(transactions);
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      <h2>清算方法</h2>
      {transactions.length === 0 ? (
        <p>清算の必要はありません。</p>
      ) : (
        <div className="section">
          <ul>
            {transactions.map((t, index) => (
              <li key={index}>
                {t.sender} → {t.receiver}: {t.amount} 円
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="section">
        <h3>立替え履歴</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.payer}</strong> : <strong>{entry.amount}</strong> 円 立替え
            </li>
          ))}
        </ul>

        <h3>貸し借り合計</h3>
        <ul>
          {Object.entries(balances).map(([member, balance]) => (
            <li key={member}>
              {member}: {balance} 円
            </li>
          ))}
        </ul>

        <div className="button-container">
          <button onClick={goToPayments} disabled={history.length === 0}>
            &lt;&lt; 立替え編集
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
