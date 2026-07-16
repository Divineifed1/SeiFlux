
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';

interface Org {
  id: string;
  login: string;
}

export function useGithubOrgs() {
  const { user } = useAuthStore();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrgs() {
      if (!user?.githubUsername) return;

      setIsLoading(true);
      try {
        const response = await fetch(`https://api.github.com/users/${user.githubUsername}/orgs`);
        if (response.ok) {
          const data = await response.json();
          setOrgs(data.map((org: any) => ({ id: org.id.toString(), login: org.login })));
        }
      } catch (error) {
        console.error('Failed to fetch GitHub organizations', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrgs();
  }, [user?.githubUsername]);

  return { orgs, isLoading };
}