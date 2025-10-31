import { useFunnel, type UseFunnelOptions } from '@use-funnel/react-router';
import { useEffect, useState } from 'react';

/** 각 스텝에서 필요한 데이터 */
type steps = {
  step1: {
    email: string;
    pw?: string;
    name?: string;
  };
  step2: {
    email: string;
    pw?: string;
    name?: string;
  };
  step3: {
    email: string;
    pw: string;
    name?: string;
  };
};

const MOCK_FETCH_DATA = {
  step: 'step3',
  data: {
    email: 'test@example.com',
    pw: 'test1234',
    name: 'Test User',
  },
};

const options: UseFunnelOptions<steps> = {
  id: 'test-funnel',
  initial: {
    step: 'step1',
    context: {
      email: '',
      pw: '',
      name: '',
    },
  },
};



export default function TestPage() {
  const funnel = useFunnel(options);

  useEffect(() => {
    // 1. fetch
    // 2. data.step에 따라 히스토리 스텝 변경

    funnel.history.replace(
      MOCK_FETCH_DATA.step as keyof steps,
      MOCK_FETCH_DATA.data
    );
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <funnel.Render
        step1={({ history }) => (
          <EmailStep onNext={(email) => history.push('step2', { email })} />
        )}
        step2={({ context, history }) => (
          <PasswordStep
            email={context.email}
            onNext={(password) =>
              history.push('step3', { ...context, pw: password })
            }
            onBack={() => history.replace('step1', {})}
          />
        )}
        step3={({ context, history }) => (
          <NameStep
            email={context.email}
            password={context.pw}
            onBack={() => history.push('step2', { ...context })}
            onSubmit={() => {
              console.log('제출:', context);
              alert('회원가입 완료!');
            }}
          />
        )}
      />
    </div>
  );
}
/**
 * 이메일 입력 스텝
 */
interface EmailStepProps {
  onNext: (email: string) => void;
}

function EmailStep({ onNext }: EmailStepProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold">이메일 입력</h2>
        <p className="text-muted-foreground mt-1">
          회원가입을 위해 이메일을 입력해주세요
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className="w-full"
        onClick={() => onNext(email)}
        disabled={!email}
      >
        다음
      </button>
    </div>
  );
}

/**
 * 비밀번호 입력 스텝
 */
interface PasswordStepProps {
  email: string;
  onNext: (password: string) => void;
  onBack: () => void;
}

function PasswordStep({ email, onNext, onBack }: PasswordStepProps) {
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold">비밀번호 입력</h2>
        <p className="text-muted-foreground mt-1">이메일: {email}</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onBack} className="flex-1">
          이전
        </button>
        <button
          className="flex-1"
          onClick={() => onNext(password)}
          disabled={!password}
        >
          다음
        </button>
      </div>
    </div>
  );
}

/**
 * 이름 입력 스텝
 */
interface NameStepProps {
  email: string;
  password: string;
  onBack: () => void;
  onSubmit: () => void;
}

function NameStep({ email, password, onBack, onSubmit }: NameStepProps) {
  const [name, setName] = useState('');

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold">이름 입력</h2>
        <p className="text-muted-foreground mt-1">
          이메일: {email} / 비밀번호: {'*'.repeat(password.length)}
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onBack} className="flex-1">
          이전
        </button>
        <button className="flex-1" onClick={onSubmit} disabled={!name}>
          완료
        </button>
      </div>
    </div>
  );
}

