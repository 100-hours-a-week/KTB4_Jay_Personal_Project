package kr.adapterz.springboot.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(
            value = """
                    select p
                    from Post p
                    join fetch p.author
                    where p.deletedAt is null
                    """,
            countQuery = """
                    select count(p)
                    from Post p
                    where p.deletedAt is null
                    """
    )
    Page<Post> findAllWithAuthorFetchJoin(Pageable pageable);

    @Query("""
            select p
            from Post p
            join fetch p.author
            where p.id = :postId
            """)
    Optional<Post> findByIdWithAuthor(@Param("postId") Long postId);
}