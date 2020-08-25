import { AuthenticationService } from './service/authentication.service';

export function appInitializer(authenticationService: AuthenticationService) {
    return () => new Promise(resolve => {
        authenticationService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}