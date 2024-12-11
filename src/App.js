// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// // 1ページ目：グループページ
// function GroupPage({ group, setGroup }) {
//   const [eventTitle, setEventTitle] = useState('');
//   const [member, setMember] = useState('');

//   const addMember = () => {
//     if (member && !group.members.includes(member)) {
//       setGroup(prev => ({
//         ...prev,
//         members: [...prev.members, member]
//       }));
//       setMember('');
//     }
//   };

//   return (
//     <div>
//       <h1>グループページ</h1>
//       <div>
//         <label>
//           イベントタイトル:
//           <input 
//             type="text" 
//             value={eventTitle} 
//             onChange={(e) => setEventTitle(e.target.value)} 
//             placeholder="イベントタイトル"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           メンバー名:
//           <input 
//             type="text" 
//             value={member} 
//             onChange={(e) => setMember(e.target.value)} 
//             placeholder="メンバー名"
//           />
//         </label>
//         <button onClick={addMember}>メンバー追加</button>
//       </div>
//       <h3>メンバー:</h3>
//       <ul>
//         {group.members.map((member, index) => (
//           <li key={index}>{member}</li>
//         ))}
//       </ul>
//       <Link to="/expense">次へ</Link>
//     </div>
//   );
// }

// // 2ページ目：立替え登録
// function ExpensePage({ group, setGroup }) {
//   const [payer, setPayer] = useState('');
//   const [receivers, setReceivers] = useState([]);
//   const [amount, setAmount] = useState('');

//   // 支払った人を選択
//   const handlePayerChange = (e) => {
//     setPayer(e.target.value);
//   };

//   // 支払う人を複数選択
//   const handleReceiverChange = (e) => {
//     const { value, checked } = e.target;
//     setReceivers((prevReceivers) =>
//       checked ? [...prevReceivers, value] : prevReceivers.filter((receiver) => receiver !== value)
//     );
//   };

//   // 立替え情報を追加
//   const addExpense = () => {
//     if (payer && receivers.length > 0 && amount > 0) {
//       const amountPerReceiver = parseFloat(amount) / receivers.length;  // 受け取る人数で金額を割る

//       setGroup((prev) => ({
//         ...prev,
//         expenses: [
//           ...prev.expenses,
//           { payer, receivers, amount: parseFloat(amount), amountPerReceiver }
//         ]
//       }));
//       setPayer('');
//       setReceivers([]);
//       setAmount('');
//     }
//   };

//   return (
//     <div>
//       <h1>立替え登録</h1>

//       {/* 支払った人を選択 */}
//       <div>
//         <label>
//           支払った人:
//           <select value={payer} onChange={handlePayerChange}>
//             <option value="">選択してください</option>
//             {group.members.map((member, index) => (
//               <option key={index} value={member}>{member}</option>
//             ))}
//           </select>
//         </label>
//       </div>

//       {/* 支払う人を複数選択 */}
//       <div>
//         <label>
//           支払った人が支払った人:
//           <div>
//             {group.members.map((member, index) => (
//               member !== payer && (
//                 <label key={index}>
//                   <input
//                     type="checkbox"
//                     value={member}
//                     checked={receivers.includes(member)}
//                     onChange={handleReceiverChange}
//                   />
//                   {member}
//                 </label>
//               )
//             ))}
//           </div>
//         </label>
//       </div>

//       {/* いくら支払ったのか */}
//       <div>
//         <label>
//           金額:
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="金額"
//           />
//         </label>
//       </div>

//       {/* 登録ボタン */}
//       <button onClick={addExpense}>登録</button>

//       <h3>立替え情報:</h3>
//       <ul>
//         {group.expenses.map((expense, index) => (
//           <li key={index}>
//             {expense.payer} が {expense.receivers.join(", ")} に ¥{expense.amount} 立て替えた
//           </li>
//         ))}
//       </ul>

//       <Link to="/settle">清算</Link>
//     </div>
//   );
// }


// // 3ページ目：清算
// function SettlePage({ group }) {
//   const [settlements, setSettlements] = useState([]);
//   const [totalBalance, setTotalBalance] = useState(group.expenses);

//   // 支払金額が多い順に並べて清算を行う
//   const calculateSettlements = () => {
//     let payment = group.members.map(member => {
//       const totalPaid = group.expenses.filter(exp => exp.payer === member).reduce((sum, exp) => sum + exp.amount, 0);
//       const totalReceived = group.expenses.filter(exp => exp.receivers.includes(member)).reduce((sum, exp) => sum + exp.amount, 0);
//       return {
//         member_name: member,
//         price_to_get: totalReceived - totalPaid,
//       };
//     });

//     let liquidation = [];
//     // 支払金額が多い順に並べる
//     payment = payment.sort((a, b) => b.price_to_get - a.price_to_get);

//     // 清算処理
//     while (payment.some(p => p.price_to_get !== 0)) {
//       const creditor = payment[0];  // 支払いを受け取る人
//       const debtor = payment[payment.length - 1];  // 支払う人

//       const amount = Math.min(creditor.price_to_get, Math.abs(debtor.price_to_get));
//       if (amount === 0) break;

//       creditor.price_to_get -= amount;
//       debtor.price_to_get += amount;

//       liquidation.push({
//         debtor: debtor.member_name,
//         creditor: creditor.member_name,
//         amount: amount
//       });

//       // 再度、支払い金額が多い順に並べ替え
//       payment = payment.sort((a, b) => b.price_to_get - a.price_to_get);
//     }

//     setSettlements(liquidation);
//   };

//   // 清算が必要かどうかを確認
//   const isSettlementNeeded = group.members.some(member => {
//     const totalPaid = group.expenses.filter(exp => exp.payer === member).reduce((sum, exp) => sum + exp.amount, 0);
//     const totalReceived = group.expenses.filter(exp => exp.receivers.includes(member)).reduce((sum, exp) => sum + exp.amount, 0);
//     return totalReceived - totalPaid !== 0;  // 支払いと受け取りの差がゼロでない場合、清算が必要
//   });

//   return (
//     <div>
//       <h1>清算</h1>
      
//       {/* 清算前の貸し借り金額 */}
//       <h2>清算前の貸し借り金額</h2>
//       {group.members.map(member => {
//         const totalPaid = group.expenses.filter(exp => exp.payer === member).reduce((sum, exp) => sum + exp.amount, 0);
//         const totalReceived = group.expenses.filter(exp => exp.receivers.includes(member)).reduce((sum, exp) => sum + exp.amount, 0);
//         const balance = totalReceived - totalPaid;
//         return <div key={member}>{member}: ¥{balance}</div>;
//       })}

//       {/* 清算ボタンは、清算が必要な場合にのみ表示 */}
//       {isSettlementNeeded ? (
//         <div>
//           <button onClick={calculateSettlements}>清算を実行</button>
          
//           {/* 清算時の送金額 */}
//           <h2>清算時の送金額</h2>
//           {settlements.length > 0 ? (
//             settlements.map((settlement, index) => (
//               <div key={index}>{settlement.debtor} → {settlement.creditor}: ¥{settlement.amount}</div>
//             ))
//           ) : (
//             <div>清算が必要ありません。</div>
//           )}

//           {/* 清算後の残債 */}
//           <h2>清算後の残債</h2>
          
//           {group.members.map(member => {
//             const totalPaid = group.expenses.filter(exp => exp.payer === member).reduce((sum, exp) => sum + exp.amount, 0);
//             const totalReceived = group.expenses.filter(exp => exp.receivers.includes(member)).reduce((sum, exp) => sum + exp.amount, 0);
//             const balance = totalReceived - totalPaid;
//             return <div key={member}>{member}: ¥{balance}</div>;
//           })}
//         </div>
//       ) : (
//         <div>清算が必要ありません。</div>
//       )}
//     </div>
//   );
// }



// // メインアプリ
// function App() {
//   const [group, setGroup] = useState({
//     members: [],
//     expenses: []
//   });

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<GroupPage group={group} setGroup={setGroup} />} />
//         <Route path="/expense" element={<ExpensePage group={group} setGroup={setGroup} />} />
//         <Route path="/settle" element={<SettlePage group={group} />} />
//       </Routes>
//     </Router>
//   );
// }


// export default App;

// import React, { useState } from "react";

// function App() {
//   const [step, setStep] = useState(1);
//   const [title, setTitle] = useState("");
//   const [members, setMembers] = useState([]);
//   const [payer, setPayer] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [involves, setInvolves] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   // イベントとメンバー登録
//   const handleGroupSubmit = (e) => {
//     e.preventDefault();
//     setMembers(membersInput.split(",").map((m) => m.trim()));
//     setStep(2);
//   };

//   // メンバー入力用
//   const [membersInput, setMembersInput] = useState("");

//   // 立替え情報登録
//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     const newHistory = [...history, { payer, amount: parseInt(amount), involves }];
//     setHistory(newHistory);
//     setPayer("");
//     setAmount(0);
//     setInvolves([]);
//   };

//   // 清算計算
//   const handleSettlement = () => {
//     const data = new Map();

//     const init = { balance: 0, consumption: 0 };
//     Map.prototype.fetch = function (id) {
//       return this.get(id) || this.set(id, Object.assign({ name: id }, init)).get(id);
//     };

//     for (const { payer, amount, involves } of history) {
//       const record = data.fetch(payer);
//       record.balance += amount;
//       const debt = Math.ceil(amount / involves.length);
//       for (const debtor of involves.map((i) => data.fetch(i))) {
//         const cost = Math.round(amount / involves.length);
//         debtor.balance -= cost;
//         debtor.consumption += cost;
//       }
//     }

//     const transaction = [];
//     let paidTooMuch, paidLess;
//     while (true) {
//       for (const [, tbl] of data) {
//         if (tbl.balance >= (paidTooMuch?.balance || 0)) {
//           paidTooMuch = tbl;
//         }
//         if (tbl.balance <= (paidLess?.balance || 0)) {
//           paidLess = tbl;
//         }
//       }

//       if (paidLess.balance === 0 || paidTooMuch.balance === 0) break;

//       const amount = Math.min(paidTooMuch.balance, Math.abs(paidLess.balance));
//       transaction.push({
//         sender: paidLess.name,
//         receiver: paidTooMuch.name,
//         amount,
//       });

//       paidTooMuch.balance -= amount;
//       paidLess.balance += amount;
//     }

//     setTransactions(transaction);
//     setStep(3);
//   };

//   return (
//     <div>
//       <h1>{title || "割り勘アプリ"}</h1>

//       {step === 1 && (
//         <div>
//           <h2>1. グループ作成</h2>
//           <form onSubmit={handleGroupSubmit}>
//             <div>
//               <label>イベント名: </label>
//               <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
//             </div>
//             <div>
//               <label>参加者 (カンマ区切り): </label>
//               <input
//                 type="text"
//                 value={membersInput}
//                 onChange={(e) => setMembersInput(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit">次へ</button>
//           </form>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h2>2. 立替え登録</h2>
//           <form onSubmit={handlePaymentSubmit}>
//             <div>
//               <label>支払者: </label>
//               <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
//                 <option value="">選択してください</option>
//                 {members.map((member) => (
//                   <option key={member} value={member}>
//                     {member}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>金額: </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>対象者 (カンマ区切り): </label>
//               <input
//                 type="text"
//                 value={involves.join(",")}
//                 onChange={(e) => setInvolves(e.target.value.split(",").map((i) => i.trim()))}
//                 required
//               />
//             </div>
//             <button type="submit">追加</button>
//           </form>

//           <h3>支払い履歴</h3>
//           <ul>
//             {history.map((entry, index) => (
//               <li key={index}>
//                 {entry.payer} が {entry.involves.join(", ")} のために {entry.amount} 円を支払った
//               </li>
//             ))}
//           </ul>

//           <button onClick={handleSettlement}>清算</button>
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <h2>3. 清算結果</h2>
//           <h3>送金表</h3>
//           <ul>
//             {transactions.map((t, index) => (
//               <li key={index}>
//                 {t.sender} → {t.receiver}: {t.amount} 円
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



// import React, { useState } from "react";

// function App() {
//   const [step, setStep] = useState(1);
//   const [title, setTitle] = useState("");
//   const [members, setMembers] = useState([]);
//   const [newMember, setNewMember] = useState("");
//   const [payer, setPayer] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [description, setDescription] = useState("");
//   const [involves, setInvolves] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [balances, setBalances] = useState([]);

//   // 参加者の追加
//   const addMember = () => {
//     if (newMember.trim() && !members.includes(newMember.trim())) {
//       setMembers([...members, newMember.trim()]);
//       setNewMember("");
//     }
//   };

//   // 参加者の削除
//   const removeMember = (name) => {
//     setMembers(members.filter((member) => member !== name));
//   };

//   // 立替え情報の登録
//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     const newHistory = [
//       ...history,
//       { payer, amount: parseInt(amount), involves, description },
//     ];
//     setHistory(newHistory);
//     setPayer("");
//     setAmount(0);
//     setDescription("");
//     setInvolves(members);
//   };

//   // 立替え履歴の削除
//   const removeHistoryItem = (index) => {
//     setHistory(history.filter((_, i) => i !== index));
//   };

//   // 清算計算
//   const handleSettlement = () => {
//     const data = new Map();
//     const init = { balance: 0, consumption: 0 };

//     Map.prototype.fetch = function (id) {
//       return this.get(id) || this.set(id, Object.assign({ name: id }, init)).get(id);
//     };

//     for (const { payer, amount, involves } of history) {
//       const record = data.fetch(payer);
//       record.balance += amount;
//       const debt = Math.ceil(amount / involves.length);
//       for (const debtor of involves.map((i) => data.fetch(i))) {
//         const cost = Math.round(amount / involves.length);
//         debtor.balance -= cost;
//         debtor.consumption += cost;
//       }
//     }

//     const transaction = [];
//     let paidTooMuch, paidLess;

//     while (true) {
//       for (const [, tbl] of data) {
//         if (tbl.balance >= (paidTooMuch?.balance || 0)) {
//           paidTooMuch = tbl;
//         }
//         if (tbl.balance <= (paidLess?.balance || 0)) {
//           paidLess = tbl;
//         }
//       }

//       if (paidLess.balance === 0 || paidTooMuch.balance === 0) break;

//       const amount = Math.min(paidTooMuch.balance, Math.abs(paidLess.balance));
//       transaction.push({
//         sender: paidLess.name,
//         receiver: paidTooMuch.name,
//         amount,
//       });

//       paidTooMuch.balance -= amount;
//       paidLess.balance += amount;
//     }

//     setTransactions(transaction);
//     setBalances([...data.values()]);
//     setStep(3);
//   };

//   return (
//     <div>
//       <h1>{title || "割り勘アプリ"}</h1>

//       {step === 1 && (
//         <div>
//           <h2>1. グループ作成</h2>
//           <div>
//             <label>イベント名: </label>
//             <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
//           </div>
//           <div>
//             <label>参加者: </label>
//             <input
//               type="text"
//               value={newMember}
//               onChange={(e) => setNewMember(e.target.value)}
//               placeholder="名前を入力"
//             />
//             <button onClick={addMember}>追加</button>
//           </div>
//           <ul>
//             {members.map((member) => (
//               <li key={member}>
//                 {member} <button onClick={() => removeMember(member)}>削除</button>
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => setStep(2)} disabled={members.length === 0 || !title}>
//             次へ
//           </button>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h2>2. 立替え登録</h2>
//           <form onSubmit={handlePaymentSubmit}>
//             <div>
//               <label>支払者: </label>
//               <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
//                 <option value="">選択してください</option>
//                 {members.map((member) => (
//                   <option key={member} value={member}>
//                     {member}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>項目名: </label>
//               <input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>金額: </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>対象者: </label>
//               {members.map((member) => (
//                 <div key={member}>
//                   <input
//                     type="checkbox"
//                     checked={involves.includes(member)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setInvolves([...involves, member]);
//                       } else {
//                         setInvolves(involves.filter((name) => name !== member));
//                       }
//                     }}
//                   />
//                   {member}
//                 </div>
//               ))}
//             </div>
//             <button type="submit">追加</button>
//           </form>

//           <h3>支払い履歴</h3>
//           <ul>
//             {history.map((entry, index) => (
//               <li key={index}>
//                 {entry.payer} が {entry.involves.join(", ")} のために「{entry.description}」で {entry.amount} 円を支払った
//                 <button onClick={() => removeHistoryItem(index)}>削除</button>
//               </li>
//             ))}
//           </ul>

//           <button onClick={handleSettlement} disabled={history.length === 0}>
//             清算
//           </button>
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <h2>3. 清算結果</h2>
//           {transactions.length === 0 ? (
//             <p>清算の必要はありません。</p>
//           ) : (
//             <>
//               <h3>送金表</h3>
//               <ul>
//                 {transactions.map((t, index) => (
//                   <li key={index}>
//                     {t.sender} → {t.receiver}: {t.amount} 円
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//           <h3>債権状態</h3>
//           <ul>
//             {balances.map((balance) => (
//               <li key={balance.name}>
//                 {balance.name}: {balance.balance} 円
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import "./App.css";
// import React, { useState ,useEffect} from "react";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<IndexPage />} />
//         <Route path="/group" element={<GroupPage />} />
//         <Route path="/payments" element={<PaymentPage />} />
//         <Route path="/settlement" element={<SettlementPage />} />
//       </Routes>
//     </Router>
//   );
// }
// function IndexPage() {
//   const navigate = useNavigate();
//   const goToGroup = () => {
//     navigate("/group");
//   };
//   return (
    
//     <div className="container" >
//   <h1>Walica</h1>
//   <div class="button-container">
//   <button onClick={goToGroup}>
//     はじめる
//   </button>
//   </div>
// </div>

//   );
// }
// function GroupPage() {
//   const [title, setTitle] = useState("");
//   const [members, setMembers] = useState([]);
//   const [newMember, setNewMember] = useState("");
//   const navigate = useNavigate();

//   const addMember = () => {
//     if (newMember.trim() && !members.includes(newMember.trim())) {
//       setMembers([...members, newMember.trim()]);
//       setNewMember("");
//     }
//   };

//   const removeMember = (name) => {
//     setMembers(members.filter((member) => member !== name));
//   };

//   const goToPayments = () => {
//     localStorage.setItem("title", title);
//     localStorage.setItem("members", JSON.stringify(members));
//     navigate("/payments");
//   };

//   return (
    
//     <div className="container">
//   <h2>グループ作成</h2>
//   <div className="form-group">
//     <label>イベント名:</label>
//     <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="北海道旅行" required />
//   </div>
//   <div className="form-group">
//     <label>参加者:</label>
//     <input
//       type="text"
//       value={newMember}
//       onChange={(e) => setNewMember(e.target.value)}
//       placeholder="名前を入力"
//     />
//     <div class="button-container">
//     <button onClick={addMember}>+ 追加</button>
//     </div>
//   </div>
//   <ul>
//     {members.map((member) => (
//       <li key={member}>
//         {member} <button onClick={() => removeMember(member)}>x 削除</button>
//       </li>
//     ))}
//   </ul>
//   <div class="button-container">
//   <button onClick={goToPayments} disabled={members.length === 0 || !title}>
//   &gt;&gt; 作成
//   </button>
//   </div>
// </div>


//   );
// }

// function PaymentPage() {
//   const title = localStorage.getItem("title");
//   const members = JSON.parse(localStorage.getItem("members")) || [];
//   const [payer, setPayer] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [description, setDescription] = useState("");
//   const [involves, setInvolves] = useState(members);
//   const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);
//   const navigate = useNavigate();

//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     const newHistory = [
//       ...history,
//       { payer, amount: parseInt(amount), involves, description },
//     ];
//     setHistory(newHistory);
//     localStorage.setItem("history", JSON.stringify(newHistory));
//     setPayer("");
//     setAmount(0);
//     setDescription("");
//     setInvolves(members);
//   };

//   const removeHistoryItem = (index) => {
//     const newHistory = history.filter((_, i) => i !== index);
//     setHistory(newHistory);
//     localStorage.setItem("history", JSON.stringify(newHistory));
//   };

//   const goToSettlement = () => {
//     navigate("/settlement");
//   };

//   return (
//     <div className="container">
//   <h1>{title}</h1>
//   <h2>立替え登録</h2>
//   <form onSubmit={handlePaymentSubmit} className="section">
//     <div className="form-group">
//       <label>支払った人:</label>
//       <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
//         <option value="">選択してください</option>
//         {members.map((member) => (
//           <option key={member} value={member}>
//             {member}
//           </option>
//         ))}
//       </select>
//     </div>
//     <div className="form-group">
//       <label>項目名:</label>
//       <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="昼食代" required />
//     </div>
//     <div className="form-group">
//       <label>金額(円):</label>
//       <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
//     </div>
//     <div className="form-group checkbox-group">
//       <label>立て替えてもらった人:</label>
//       {members.map((member) => (
//         <div key={member}>
//           <input
//             type="checkbox"
//             checked={involves.includes(member)}
//             onChange={(e) => {
//               if (e.target.checked) {
//                 setInvolves([...involves, member]);
//               } else {
//                 setInvolves(involves.filter((name) => name !== member));
//               }
//             }}
//           />
//           {member}
//         </div>
//       ))}
//     </div>
//     <div class="button-container">
//     <button type="submit">+ 登録</button>
//     </div>
//   </form>

//   <h3>支払い履歴</h3>
//   <ul>
//     {history.map((entry, index) => (
//       <li key={index}>
//         {entry.description} : {entry.payer} → {entry.involves.join("・")}  {entry.amount} 円
//         <button onClick={() => removeHistoryItem(index)}>x 削除</button>
//       </li>
//     ))}
//   </ul>

//   <div class="button-container">
//   <button onClick={goToSettlement} disabled={history.length === 0}>
//     &gt;&gt; 清算
//   </button>
//   </div>
// </div>

//   );
// }

// function SettlementPage() {
//   const title = localStorage.getItem("title");
//   const history = JSON.parse(localStorage.getItem("history")) || [];
//   const members = JSON.parse(localStorage.getItem("members")) || [];

//   const [balances, setBalances] = useState({});
//   const [transactions, setTransactions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     calculateBalances();
//   }, []);

//   useEffect(() => {
//     calculateTransactions();
//   }, [balances]);

//   const goToPayments = () => {
//     navigate("/payments");
//   };

//   // 債権状態を計算する関数
//   const calculateBalances = () => {
//     const balanceSheet = {};

//     // 初期化
//     members.forEach((member) => {
//       balanceSheet[member] = 0;
//     });

//     // 支払い履歴をもとに債権状態を計算
//     history.forEach(({ payer, amount, involves }) => {
//       const perPersonAmount = Math.ceil(amount / involves.length);
//       balanceSheet[payer] += amount;

//       involves.forEach((person) => {
//         balanceSheet[person] -= perPersonAmount;
//       });
//     });

//     setBalances(balanceSheet);
//   };

//   // 最小回数で清算するための送金表を計算する関数
//   const calculateTransactions = () => {
//     const balanceArray = Object.entries(balances).map(([name, balance]) => ({
//       name,
//       balance,
//     }));

//     const transactions = [];

//     let creditors = balanceArray.filter((p) => p.balance > 0);
//     let debtors = balanceArray.filter((p) => p.balance < 0);

//     while (creditors.length && debtors.length) {
//       const creditor = creditors[0];
//       const debtor = debtors[0];

//       const amount = Math.min(creditor.balance, -debtor.balance);

//       transactions.push({
//         sender: debtor.name,
//         receiver: creditor.name,
//         amount,
//       });

//       creditor.balance -= amount;
//       debtor.balance += amount;

//       if (creditor.balance === 0) creditors.shift();
//       if (debtor.balance === 0) debtors.shift();
//     }

//     setTransactions(transactions);
//   };

//   return (
//     <div className="container">
//   <h1>{title}</h1>
//   <h2>清算方法</h2>
//   {transactions.length === 0 ? (
//     <p>清算の必要はありません。</p>
//   ) : (
//     <div className="section">
//       <ul>
//         {transactions.map((t, index) => (
//           <li key={index} >
//             {t.sender} → {t.receiver}: {t.amount} 円
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}

//   <div className="section">

//   <h3>立替え履歴</h3>
//   <ul>
//     {history.map((entry, index) => (
//       <li key={index}>
//         <strong>{entry.payer}</strong> :<strong>{entry.amount} </strong>円 立替え
//       </li>
//     ))}
//   </ul>
//     <h3>貸し借り合計</h3>
//     <ul>
//       {Object.entries(balances).map(([member, balance]) => (
//         <li key={member}>
//           {member}: {balance} 円
//         </li>
//       ))}
//     </ul>
//     <div class="button-container">
//     <button onClick={goToPayments} disabled={history.length === 0}>
//     &lt; &lt;立替え編集
//     </button>
//     </div>
    
//   </div>

  

  
// </div>

//   );
// }




// import "./App.css";
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<IndexPage />} />
//         <Route path="/group" element={<GroupPage />} />
//         <Route path="/payments" element={<PaymentPage />} />
//         <Route path="/settlement" element={<SettlementPage />} />
//       </Routes>
//     </Router>
//   );
// }

// function IndexPage() {
//   const navigate = useNavigate();
//   const goToGroup = () => {
//     navigate("/group");
//   };
//   return (
//     <div className="container">
//       <h1>ウェイト勘定</h1>
//       <div className="button-container">
//         <button onClick={goToGroup}>はじめる</button>
//       </div>
//     </div>
//   );
// }

// function GroupPage() {
//   const [title, setTitle] = useState("");
//   const [members, setMembers] = useState([]);
//   const [newMember, setNewMember] = useState("");
//   const [weights, setWeights] = useState({});
//   const navigate = useNavigate();

//   const addMember = () => {
//     if (newMember.trim() && !members.includes(newMember.trim())) {
//       setMembers([...members, newMember.trim()]);
//       setWeights({ ...weights, [newMember.trim()]: 1 }); // 初期重みは1
//       setNewMember("");
//     }
//   };

//   const removeMember = (name) => {
//     setMembers(members.filter((member) => member !== name));
//     const newWeights = { ...weights };
//     delete newWeights[name];
//     setWeights(newWeights);
//   };

//   const updateWeight = (name, weight) => {
//     setWeights({ ...weights, [name]: parseFloat(weight) });
//   };

//   const goToPayments = () => {
//     localStorage.setItem("title", title);
//     localStorage.setItem("members", JSON.stringify(members));
//     localStorage.setItem("weights", JSON.stringify(weights));
//     navigate("/payments");
//   };

//   const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

//   return (
//     <div className="container">
//       <h2>グループ作成</h2>
//       <div className="form-group">
//         <label>イベント名:</label>
//         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="北海道旅行" required />
//       </div>
//       <div className="form-group">
//         <label>参加者:</label>
//         <input
//           type="text"
//           value={newMember}
//           onChange={(e) => setNewMember(e.target.value)}
//           placeholder="名前を入力"
//         />
//         <div className="button-container">
//           <button onClick={addMember}>+ 追加</button>
//         </div>
//       </div>
//       <ul>
//       <h3>重み入力</h3>
//         {members.map((member) => (
//           <li key={member}>
//             <span className="member-name">{member.length > 6 ? member.slice(0, 6) + '\n' + member.slice(6) : member}</span>

            
//             <input
//               type="number"
//               value={weights[member]}
//               onChange={(e) => updateWeight(member, e.target.value)}
//               min="0"
//               step="1"
//             />

//             <button onClick={() => removeMember(member)} style={{ whiteSpace: "nowrap" }}>x 削除</button>

//           </li>
//         ))}
//       </ul>
//       <div className="button-container">
//         <button onClick={goToPayments} disabled={members.length === 0 || totalWeight <= 0}>
//           &gt;&gt; 作成
//         </button>
//       </div>
//     </div>
//   );
// }

// function PaymentPage() {
//   const title = localStorage.getItem("title");
//   const members = JSON.parse(localStorage.getItem("members")) || [];
//   const weights = JSON.parse(localStorage.getItem("weights")) || {};
//   const [payer, setPayer] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [description, setDescription] = useState("");
//   const [involves, setInvolves] = useState(members);
//   const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);
//   const navigate = useNavigate();

//      const removeHistoryItem = (index) => {
//      const newHistory = history.filter((_, i) => i !== index);
//      setHistory(newHistory);
//      localStorage.setItem("history", JSON.stringify(newHistory));
//    };

//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     const totalWeight = involves.reduce((sum, member) => sum + weights[member], 0);
//     const weightedAmounts = involves.map((member) => ({
//       member,
//       share: Math.ceil((amount * weights[member]) / totalWeight),
//     }));

//     const newHistory = [
//       ...history,
//       { payer, amount: parseInt(amount), involves, description, weightedAmounts },
//     ];
//     setHistory(newHistory);
//     localStorage.setItem("history", JSON.stringify(newHistory));
//     setPayer("");
//     setAmount(0);
//     setDescription("");
//     setInvolves(members);
//   };

//   const goToSettlement = () => {
//     navigate("/settlement");
//   };

//   return (
//     <div className="container">
//       <h1>{title}</h1>
//       <h2>立替え登録</h2>
//       <form onSubmit={handlePaymentSubmit} className="section">
//         <div className="form-group">
//           <label>支払った人:</label>
//           <select value={payer} onChange={(e) => setPayer(e.target.value)} required>
//             <option value="">選択してください</option>
//             {members.map((member) => (
//               <option key={member} value={member}>
//                 {member}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label>項目名:</label>
//           <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="昼食代" required />
//         </div>
//         <div className="form-group">
//           <label>金額(円):</label>
//           <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
//         </div>
//         <div className="form-group checkbox-group">
//           <label>立て替えてもらった人:</label>
//           {members.map((member) => (
//             <div key={member}>
//               <input
//                 type="checkbox"
//                 checked={involves.includes(member)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setInvolves([...involves, member]);
//                   } else {
//                     setInvolves(involves.filter((name) => name !== member));
//                   }
//                 }}
//               />
//               {member}
//             </div>
//           ))}
//         </div>
//         <div className="button-container">
//           <button type="submit">+ 登録</button>
//         </div>
//       </form>
//          <h3>支払い履歴</h3>
//    <ul>
//      {history.map((entry, index) => (
//        <li key={index}>
//          {entry.description} : {entry.payer} → {entry.involves.join("・")}  {entry.amount} 円
//          <button onClick={() => removeHistoryItem(index)} style={{ whiteSpace: "nowrap" }}>x 削除</button>
//        </li>
//      ))}
//    </ul>
//       <div className="button-container">
//         <button onClick={goToSettlement} disabled={history.length === 0}>
//           &gt;&gt; 清算
//         </button>
//       </div>
//     </div>
//   );
// }
// function SettlementPage() {
//   const title = localStorage.getItem("title");
//   const history = JSON.parse(localStorage.getItem("history")) || [];
//   const members = JSON.parse(localStorage.getItem("members")) || [];
//   const weights = JSON.parse(localStorage.getItem("weights")) || {};

//   const [balances, setBalances] = useState({});
//   const [transactions, setTransactions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     calculateBalances();
//   }, []);

//   useEffect(() => {
//     calculateTransactions();
//   }, [balances]);

//   const goToPayments = () => {
//     navigate("/payments");
//   };

//   // 債権状態を計算する関数
//   const calculateBalances = () => {
//     const balanceSheet = {};

//     // 初期化
//     members.forEach((member) => {
//       balanceSheet[member] = 0;
//     });

//     // 支払い履歴をもとに債権状態を計算
//     history.forEach(({ payer, amount, involves }) => {
//       const totalWeight = involves.reduce((sum, person) => sum + (weights[person] ), 0);
//       const perPersonAmount = Math.ceil(amount / totalWeight);

//       balanceSheet[payer] += amount;

//       involves.forEach((person) => {
//         balanceSheet[person] -= perPersonAmount * (weights[person] );
//       });
//     });

//     setBalances(balanceSheet);
//   };

//   // 最小回数で清算するための送金表を計算する関数
//   const calculateTransactions = () => {
//     const balanceArray = Object.entries(balances).map(([name, balance]) => ({
//       name,
//       balance,
//     }));

//     const transactions = [];

//     let creditors = balanceArray.filter((p) => p.balance > 0);
//     let debtors = balanceArray.filter((p) => p.balance < 0);

//     while (creditors.length && debtors.length) {
//       const creditor = creditors[0];
//       const debtor = debtors[0];

//       const amount = Math.min(creditor.balance, -debtor.balance);

//       transactions.push({
//         sender: debtor.name,
//         receiver: creditor.name,
//         amount,
//       });

//       creditor.balance -= amount;
//       debtor.balance += amount;

//       if (creditor.balance === 0) creditors.shift();
//       if (debtor.balance === 0) debtors.shift();
//     }

//     setTransactions(transactions);
//   };

//   return (
//     <div className="container">
//       <h1>{title}</h1>
//       <h2>清算方法</h2>
//       {transactions.length === 0 ? (
//         <p>清算の必要はありません。</p>
//       ) : (
//         <div className="section">
//           <ul>
//             {transactions.map((t, index) => (
//               <li key={index}>
//                 {t.sender} → {t.receiver}: {t.amount} 円
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="section">
//         <h3>立替え履歴</h3>
//         <ul>
//           {history.map((entry, index) => (
//             <li key={index}>
//               <strong>{entry.payer}</strong> : <strong>{entry.amount}</strong> 円 立替え
//             </li>
//           ))}
//         </ul>

//         <h3>貸し借り合計</h3>
//         <ul>
//           {Object.entries(balances).map(([member, balance]) => (
//             <li key={member}>
//               {member}: {balance} 円
//             </li>
//           ))}
//         </ul>

//         <div className="button-container">
//           <button onClick={goToPayments} disabled={history.length === 0}>
//             &lt;&lt; 立替え編集
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;




import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,useParams } from "react-router-dom";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion  } from "firebase/firestore";
import { db } from "./firebase";


function App() {
  return (
    <Router>
      {/* <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/settlement" element={<SettlementPage />} />
      </Routes> */}
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
